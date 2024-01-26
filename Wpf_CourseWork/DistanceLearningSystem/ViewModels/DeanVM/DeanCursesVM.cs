using System;
using System.Collections.ObjectModel;
using System.Windows.Input;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.Models;
using DistanceLearningSystem.Navigation;
using DistanceLearningSystem.ViewModels.MainVM;
using DistanceLearningSystem.Views.Pages.Dean;

namespace DistanceLearningSystem.ViewModels.DeanVM
{
    public class DeanCursesViewModel : ViewModelBase
    {
        public ObservableCollection<byte> CursesList { get; set; }

        public DeanCursesViewModel()
        {
            using (UnitOfWork unitOfWork = new UnitOfWork())
            {
                var num = unitOfWork.FacultyRepository.Get(Account.Faculty)?.NumberOfCourses;
                CursesList = new ObservableCollection<byte>();
                for (byte i = 1; i <= num; i++)
                    CursesList.Add(i);
            }
        }

        public ICommand NavigateCurseCommand => new RelayCommand(
            (obj) =>
            {
                MainNavigation.CurrentCurse = (byte)obj;
                UndoRedo.UndoRedoManager.Do(() =>
                {
                    MainNavigation.CurrentPage = "Specialities";
                    ((DeanCoursePage)MainNavigation.GetPage("DeanCurse")).DataContext = new DeanCourseViewModel();
                    ((DeanPage)MainNavigation.GetPage("Dean")).Frame.Navigate(MainNavigation.GetPage("DeanCurse"));
                    ((SpecialitiesPage)MainNavigation.GetPage("DeanSpecialities")).DataContext =
                        new DeanSpecialityViewModel();
                    ((DeanCoursePage)MainNavigation.GetPage("DeanCurse")).Frame.Navigate(MainNavigation.GetPage("DeanSpecialities"));
                });
            }
        );
    }
}