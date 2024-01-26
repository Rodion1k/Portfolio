using System.Windows.Input;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.Models;
using DistanceLearningSystem.Navigation;
using DistanceLearningSystem.ViewModels.MainVM;
using DistanceLearningSystem.Views.Pages.Teacher;

namespace DistanceLearningSystem.ViewModels.TeacherVM
{
    public class TeacherSubjectViewModel : ViewModelBase
    {
        public Subject Subject { get; }

        public TeacherSubjectViewModel()
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
                MainNavigation.CurrentPage = "Subject";
                ((TeacherLecturesPage)MainNavigation.GetPage("TeacherLectures")).DataContext =
                    new TeacherLecturesViewModel();
                ((TeacherSubjectPage)MainNavigation.GetPage("TeacherSubject")).Frame.Navigate(
                    MainNavigation.GetPage("TeacherLectures"));
            });
        });

        public ICommand OpenTestsCommand => new RelayCommand((obj) =>
        {
            UndoRedo.UndoRedoManager.Do(() =>
            {
                MainNavigation.CurrentPage = "Subject";
                ((TeacherTestsPage)MainNavigation.GetPage("TeacherTests")).DataContext =
                    new TeacherTestsViewModel();
                ((TeacherSubjectPage)MainNavigation.GetPage("TeacherSubject")).Frame.Navigate(
                    MainNavigation.GetPage("TeacherTests"));
            });
        });
    }
}