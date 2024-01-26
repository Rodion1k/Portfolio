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
using DistanceLearningSystem.Views.Pages.Student;

namespace DistanceLearningSystem.ViewModels.StudentVM
{
    public class StudentTestsViewModel : ViewModelBase
    {
        private ObservableCollection<CustomTest> _customTests;

        public ObservableCollection<CustomTest> TestsList
        {
            get => _customTests;
            private set
            {
                _customTests = value;
                OnPropertyChanged("TestsList");
            }
        }

        public StudentTestsViewModel()
        {
            TestsList = new ObservableCollection<CustomTest>();
            using (var unitOfWork = new UnitOfWork())
            {
                var tests = new ObservableCollection<Test>(
                    unitOfWork.TestsRepository.Find(x => x.SubjectId == MainNavigation.CurrentSubject));
                foreach (var test in tests)
                {
                    var customTest = new CustomTest(test);
                    var results = unitOfWork.TestsResultsRepository
                        .Find(x => x.TestId == test.Id && x.UserProfileId == Account.Id).ToList();
                    if (results.Count != 0)
                    {
                        customTest.Mark = results.First().Mark;
                        customTest.Opacity = 0.5;
                        customTest.IsEnabled = false;
                        customTest.Visibility = Visibility.Visible;
                    }

                    TestsList.Add(customTest);
                }
            }
        }

        public ICommand OpenTestCommand =>
            new RelayCommand((obj) =>
            {
                try
                {
                    var test = (CustomTest)obj;
                    UndoRedo.UndoRedoManager.Do(() =>
                    {
                        MainNavigation.CurrentPage = "TestStudent";
                        MainNavigation.CurrentTest = test.Id;
                        ((StudentTestPage)MainNavigation.GetPage("StudentTest")).DataContext =
                            new StudentTestViewModel();
                        ((StudentPage)MainNavigation.GetPage("Student")).Frame.Navigate(
                            MainNavigation.GetPage("StudentTest"));
                    });
                    UndoRedo.UndoRedoManager.ClearToIndex(1);
                }
                catch (Exception)
                {
                    MessageBox.Show("Ошибка при открытии теста");
                }
            });
    }
}