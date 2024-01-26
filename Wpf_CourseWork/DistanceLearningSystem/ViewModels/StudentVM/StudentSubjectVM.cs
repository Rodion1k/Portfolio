using System.Windows.Input;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.Models;
using DistanceLearningSystem.Navigation;
using DistanceLearningSystem.ViewModels.MainVM;
using DistanceLearningSystem.Views.Pages.Student;


namespace DistanceLearningSystem.ViewModels.StudentVM
{
    public class StudentSubjectViewModel : ViewModelBase
    {
        public Subject Subject { get; }

        public StudentSubjectViewModel()
        {
            using (var unitOfWork = new UnitOfWork())
            {
                Subject = unitOfWork.SubjectRepository.Get(MainNavigation.CurrentSubject);
            }
        }

        public ICommand OpenLecturesCommand => new RelayCommand((obj) =>
        {
            if (UndoRedo.UndoRedoManager.UndoCount == 2) return;
            UndoRedo.UndoRedoManager.Do(() =>
            {
                ((StudentLecturesPage)MainNavigation.GetPage("StudentLectures")).DataContext =
                    new StudentLecturesViewModel();
                ((StudentSubjectPage)MainNavigation.GetPage("StudentSubject")).Frame.Navigate(
                    MainNavigation.GetPage("StudentLectures"));
            });
        });

        public ICommand OpenTestsCommand => new RelayCommand((obj) =>
        {
            UndoRedo.UndoRedoManager.Do(() =>
            {
                ((StudentTestsPage)MainNavigation.GetPage("StudentTests")).DataContext =
                    new StudentTestsViewModel();
                ((StudentSubjectPage)MainNavigation.GetPage("StudentSubject")).Frame.Navigate(
                    MainNavigation.GetPage("StudentTests"));
            });
          
        });
    }
}