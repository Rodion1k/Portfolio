using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows.Input;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.Models;
using DistanceLearningSystem.Navigation;
using DistanceLearningSystem.ViewModels.MainVM;
using DistanceLearningSystem.Views.Pages.Teacher;

namespace DistanceLearningSystem.ViewModels.TeacherVM
{
    public class CustomSubject
    {
        public Guid Id { get; set; }
        public string Faculty { get; set; }
        public string Name { get; set; }
        public string FullName { get; set; }

        public CustomSubject(Subject subject)
        {
            Id = subject.Id;
            Name = subject.Name;
            FullName = subject.FullName;
        }
    }

    public class TeacherSubjectsViewModel : ViewModelBase
    {
        private ObservableCollection<CustomSubject> _customSubjects;

        public ObservableCollection<CustomSubject> CustomSubjects
        {
            get => _customSubjects;
            private set
            {
                _customSubjects = value;
                OnPropertyChanged("CustomSubjects");
            }
        }
        
        public TeacherSubjectsViewModel()
        {
            MainNavigation.CurrentPage = "Subjects";
            CustomSubjects = new ObservableCollection<CustomSubject>();
            using (var unitOfWork = new UnitOfWork())
            {
                var subjectsUserProfilesList = unitOfWork.SubjectsUserProfilesRepository
                    .GetWithInclude(x => x.UserProfileId == Account.Id)
                    .ToList();
                foreach (var l in subjectsUserProfilesList.Where(l => l.SubjectId != null))
                {
                    if (l.SubjectId != null)
                        CustomSubjects.Add(new CustomSubject(unitOfWork.SubjectRepository.Get((Guid)l.SubjectId)));
                }

                foreach (var item in CustomSubjects)
                {
                    var facultyId = unitOfWork.SubjectSpecialities.GetWithInclude(x => x.SubjectId == item.Id,
                        x => x.Speciality).Select(x => x.Speciality).FirstOrDefault()?.FacultyId;
                    if (facultyId != null) item.Faculty = unitOfWork.FacultyRepository.Get((Guid)facultyId).Name;
                }
            }
        }

        public ICommand OpenSubjectCommand => new RelayCommand((obj) =>
            {
                var subject = (CustomSubject)obj;
                UndoRedo.UndoRedoManager.Do(() =>
                    {
                        MainNavigation.CurrentPage = "Subject";
                        MainNavigation.CurrentSubject = subject.Id;
                        ((TeacherSubjectPage)MainNavigation.GetPage("TeacherSubject")).DataContext =
                            new TeacherSubjectViewModel();
                        ((TeacherPage)MainNavigation.GetPage("Teacher")).Frame.Navigate(
                            MainNavigation.GetPage("TeacherSubject"));
                        ((TeacherLecturesPage)MainNavigation.GetPage("TeacherLectures")).DataContext =
                            new TeacherLecturesViewModel();
                        ((TeacherSubjectPage)MainNavigation.GetPage("TeacherSubject")).Frame.Navigate(
                            MainNavigation.GetPage("TeacherLectures"));
                    }
                );
            }
        );
    }
}