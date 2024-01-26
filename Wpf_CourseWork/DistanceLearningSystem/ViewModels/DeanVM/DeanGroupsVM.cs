using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows;
using System.Windows.Input;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.Models;
using DistanceLearningSystem.Models.CustomModels;
using DistanceLearningSystem.Navigation;
using DistanceLearningSystem.ViewModels.MainVM;
using DistanceLearningSystem.Views.Pages.Dean;

namespace DistanceLearningSystem.ViewModels.DeanVM
{
    public class DeanGroupsViewModel : ViewModelBase
    {
        private ObservableCollection<Group> _groups;
        private Group _group;
        private ObservableCollection<CustomSubject> _customSubjects;

        public ObservableCollection<CustomSubject> CustomSubjects
        {
            get => _customSubjects;
            set
            {
                _customSubjects = value;
                OnPropertyChanged("CustomSubjects");
            }
        }


        public ObservableCollection<Group> GroupsList
        {
            get => _groups;
            private set
            {
                _groups = value;
                OnPropertyChanged("GroupsList");
            }
        }

        public DeanGroupsViewModel()
        {
            _group = new Group();
            _customSubjects = new ObservableCollection<CustomSubject>();
            using (UnitOfWork unitOfWork = new UnitOfWork())
            {
                var subjects =
                    unitOfWork.SubjectSpecialities.GetWithInclude(
                            x => x.SpecialityId == MainNavigation.CurrentSpecialty, x => x.Subject)
                        .Select(x => x.Subject).Where(x => x.Year == MainNavigation.CurrentCurse);
                var subjects1 = new ObservableCollection<Subject>(subjects);
                foreach (var subject in subjects1)
                {
                    var customSubject = new CustomSubject(subject)
                    {
                        Teacher = unitOfWork.SubjectsUserProfilesRepository.GetWithInclude(
                                x => x.SubjectId == subject.Id,
                                n => n.UserProfile)
                            .Select(n => n.UserProfile).FirstOrDefault()
                    };
                    CustomSubjects.Add(customSubject);
                }

                GroupsList = new ObservableCollection<Group>(unitOfWork.GroupRepository
                    .GetWithInclude(x => x.Year == MainNavigation.CurrentCurse, n => n.Speciality)
                    .Where(x => x.SpecialtyId == MainNavigation.CurrentSpecialty));
            }
        }

        public int GroupNumber
        {
            get => _group.Number;
            set
            {
                _group.Number = value;
                OnPropertyChanged("GroupNumber");
            }
        }

        public ICommand AddGroup =>
            new RelayCommand((obj) =>
            {
                using (UnitOfWork unitOfWork = new UnitOfWork())
                {
                    var spec = unitOfWork.SpecialityRepository.Find(x => x.FacultyId == Account.Faculty);
                    foreach (var item in spec)
                    {
                        var groups = unitOfWork.GroupRepository.Find(x =>
                            x.SpecialtyId == item.Id && x.Year == MainNavigation.CurrentCurse);
                        foreach (var group in groups)
                        {
                            if (group.Number == GroupNumber)
                            {
                                MessageBox.Show("Группа с таким номером уже существует");
                                return;
                            }
                        }
                    }

                    var speciality = unitOfWork.SpecialityRepository.Get(MainNavigation.CurrentSpecialty);
                    _group.Id = Guid.NewGuid();
                    _group.Year = MainNavigation.CurrentCurse;
                    _group.SpecialtyId = speciality.Id;
                    unitOfWork.GroupRepository.Create(_group);
                    _groups.Add(_group);
                }

                _group = new Group();// Clear();
                GroupNumber = 0;
            });

        public ICommand OpenSubjectCommand =>
            new RelayCommand((obj) =>
            {
                var subject = (CustomSubject)obj;
                UndoRedo.UndoRedoManager.Do(() =>
                {
                    MainNavigation.CurrentPage = "ManageSubject";
                    MainNavigation.CurrentSubject = subject.Id;
                    ((SubjectPage)MainNavigation.GetPage("DeanSubject")).DataContext =
                        new DeanSubjectViewModel();
                    ((DeanPage)MainNavigation.GetPage("Dean")).Frame.Navigate(MainNavigation.GetPage("DeanSubject"));
                });
            });


        public ICommand OpenGroupCommand =>
            new RelayCommand((obj) =>
            {
                var group = (Group)obj;
                UndoRedo.UndoRedoManager.Do(() =>
                {
                    MainNavigation.CurrentPage = "ManageGroup";
                    MainNavigation.CurrentGroup = group.Id;
                    ((StudentsPage)MainNavigation.GetPage("DeanStudents")).DataContext = new DeanStudentsViewModel();
                    ((DeanPage)MainNavigation.GetPage("Dean")).Frame.Navigate(MainNavigation.GetPage("DeanStudents"));
                });
            });
    }
}