using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows.Input;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.Models;
using DistanceLearningSystem.Navigation;
using DistanceLearningSystem.ViewModels.MainVM;
using DistanceLearningSystem.Views.Pages.Student;

namespace DistanceLearningSystem.ViewModels.StudentVM
{
    public class StudentSubjectsViewModel : ViewModelBase
    {
        private ObservableCollection<Subject> _subjectsList;

        public ObservableCollection<Subject> SubjectsList
        {
            get => _subjectsList;
            private set
            {
                _subjectsList = value;
                OnPropertyChanged("SubjectsList");
            }
        }

        public StudentSubjectsViewModel()
        {
            SubjectsList = new ObservableCollection<Subject>();
            using (UnitOfWork unitOfWork = new UnitOfWork())
            {
                var kek = unitOfWork.SubjectSpecialities.Find(x => x.SpecialityId == Account.Specialty);
                foreach (var l in kek.Where(l => l.SubjectId != null))
                {
                    if (l.SubjectId != null) SubjectsList.Add(unitOfWork.SubjectRepository.Get((Guid)l.SubjectId));
                }
            }
        }

        public ICommand OpenSubjectCommand => new RelayCommand((obj) =>
            {
                var subject = (Subject)obj;
                UndoRedo.UndoRedoManager.Do(() =>
                {
                    MainNavigation.CurrentPage = "SubjectStudent";
                    MainNavigation.CurrentSubject = subject.Id;
                    ((StudentSubjectPage)MainNavigation.GetPage("StudentSubject")).DataContext =
                        new StudentSubjectViewModel();
                    ((StudentPage)MainNavigation.GetPage("Student")).Frame.Navigate(
                        MainNavigation.GetPage("StudentSubject"));
                    ((StudentLecturesPage)MainNavigation.GetPage("StudentLectures")).DataContext =
                        new StudentLecturesViewModel();
                    ((StudentSubjectPage)MainNavigation.GetPage("StudentSubject")).Frame.Navigate(
                        MainNavigation.GetPage("StudentLectures"));
                });
            }
        );
    }
}