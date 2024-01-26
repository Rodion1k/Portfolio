using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows;
using System.Windows.Input;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.DataBase.Context;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.Models;
using DistanceLearningSystem.Navigation;
using DistanceLearningSystem.ViewModels.MainVM;

namespace DistanceLearningSystem.ViewModels.DeanVM
{
    
    public class DeanSubjectsViewModel : ViewModelBase
    {
        private Subject _subject;
        private ObservableCollection<Subject> _subjects;
        private SubjectSpecialities _subjectSpecialities;
        private ObservableCollection<Speciality> _specialities;
        public ObservableCollection<SelectedSpeciality> SelectedSpeciality { get; set; }
        

        private ObservableCollection<Speciality> Specialities
        {
            get => _specialities;
            set
            {
                _specialities = value;
                OnPropertyChanged("Specialities");
            }
        }

        public ObservableCollection<Subject> SubjectList
        {
            get => _subjects;
            private set
            {
                _subjects = value;
                OnPropertyChanged("SubjectList");
            }
        }

        public string SubjectName
        {
            get => _subject.Name;
            set
            {
                _subject.Name = value;
                OnPropertyChanged("SubjectName");
            }
        }

        public string SubjectFullName
        {
            get => _subject.FullName;
            set
            {
                _subject.FullName = value;
                OnPropertyChanged("SubjectFullName");
            }
        }


        public DeanSubjectsViewModel()
        {
            SelectedSpeciality = new ObservableCollection<SelectedSpeciality>();
            _subject = new Subject();
            _subjectSpecialities = new SubjectSpecialities();
            SubjectList = new ObservableCollection<Subject>();
            Specialities = new ObservableCollection<Speciality>();
            
            using (UnitOfWork unitOfWork = new UnitOfWork())
            {
                Specialities = new ObservableCollection<Speciality>(
                    unitOfWork.SpecialityRepository.GetWithInclude(x => x.FacultyId == Account.Faculty, n => n.Groups));
                foreach (var item in Specialities)
                {
                    SelectedSpeciality.Add(new SelectedSpeciality() { Id = item.Id, Name = item.Name });
                }
                var spec = unitOfWork.SpecialityRepository.Find(x => x.FacultyId == Account.Faculty);
                foreach (var item in spec)
                {
                    var sub = unitOfWork.SubjectSpecialities
                        .GetWithInclude(x => x.SpecialityId == item.Id, n => n.Subject).Select(n => n.Subject)
                        .Where(n => n.Year == MainNavigation.CurrentCurse);
                    foreach (var s in sub)
                    {
                        if(SubjectList.FirstOrDefault(x=>x.Id==s.Id)!=null) continue;
                        SubjectList.Add(s);
                    }
                }

            }
        }

        public ICommand AddSubject =>
            new RelayCommand((obj) =>
            {
                using (UnitOfWork unitOfWork = new UnitOfWork())
                {
                    var spec = SelectedSpeciality.Where(x => x.IsChecked).ToList();
                    if (spec.Count == 0)
                    {
                        MessageBox.Show("Выберите специальность");
                        return;
                    }
                    _subject.Id = Guid.NewGuid();
                    _subject.Year = MainNavigation.CurrentCurse;
                    unitOfWork.SubjectRepository.Create(_subject);
                    foreach (var item in spec)
                    {
                        var speciality = unitOfWork.SpecialityRepository.Get(item.Id);
                        _subjectSpecialities.Id = Guid.NewGuid();
                        _subjectSpecialities.SubjectId = _subject.Id;
                        _subjectSpecialities.SpecialityId = speciality.Id;
                        unitOfWork.SubjectSpecialities.Create(_subjectSpecialities);
                        _subjectSpecialities = new SubjectSpecialities();
                    }
                    SubjectList.Add(_subject);
                }
                Clear();
            });

        private void Clear()
        {
            _subject = new Subject();
            SubjectName = "";
            SubjectFullName = "";
        }
    }
    
    public class SelectedSpeciality : ViewModelBase
    {
        public string Name { get; set; }
        public Guid Id { get; set; }
        private bool _isChecked;

        public bool IsChecked
        {
            get => _isChecked;
            set
            {
                _isChecked = value;
                OnPropertyChanged("IsChecked");
            }
        }
    }
}