using System.Windows.Input;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.Navigation;
using DistanceLearningSystem.ViewModels.MainVM;
using DistanceLearningSystem.Views.Pages.Dean;

namespace DistanceLearningSystem.ViewModels.DeanVM
{
    public class DeanCourseViewModel : ViewModelBase
    {
        public ICommand OpenSpecialitiesCommand => new RelayCommand((obj) =>
        {
            if (UndoRedo.UndoRedoManager.UndoCount == 2) return;
            UndoRedo.UndoRedoManager.Do(() =>
            {
                MainNavigation.CurrentPage = "Specialities";
                ((SpecialitiesPage)MainNavigation.GetPage("DeanSpecialities")).DataContext =
                    new DeanSpecialityViewModel();
                ((DeanCoursePage)MainNavigation.GetPage("DeanCurse")).Frame.Navigate(
                    MainNavigation.GetPage("DeanSpecialities"));
            });
        });

        public ICommand OpenSubjectsCommand => new RelayCommand((obj) =>
        {
            UndoRedo.UndoRedoManager.Do(() =>
            {
                MainNavigation.CurrentPage = "Subjects";
                ((DeanSubjects)MainNavigation.GetPage("DeanSubjects")).DataContext =
                    new DeanSubjectsViewModel();
                ((DeanCoursePage)MainNavigation.GetPage("DeanCurse")).Frame.Navigate(
                    MainNavigation.GetPage("DeanSubjects"));
            });
        });
    }
}