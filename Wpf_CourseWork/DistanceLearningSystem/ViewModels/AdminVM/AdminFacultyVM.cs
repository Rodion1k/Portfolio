using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.Models;
using DistanceLearningSystem.Models.CustomModels;
using DistanceLearningSystem.Navigation;
using DistanceLearningSystem.ViewModels.MainVM;
using DistanceLearningSystem.Views.Pages.Admin;
using Microsoft.Win32;

namespace DistanceLearningSystem.ViewModels.AdminVM
{
    public class AdminFacultyViewModel : ViewModelBase
    {
        private ObservableCollection<CustomFaculty> _faculties;
        private Faculty _faculty;
        private int _selectedItemsCount;
        private readonly int _count;
        private string _searchText;
        private readonly ObservableCollection<CustomFaculty> _tableSearch;

        public ObservableCollection<CustomFaculty> CustomFaculties
        {
            get => _faculties;
            private set
            {
                _faculties = value;
                OnPropertyChanged("CustomFaculties");
            }
        }

        public int SelectedItemsCount
        {
            get => _selectedItemsCount;
            set
            {
                _selectedItemsCount = value;
                OnPropertyChanged("SelectedItemsCount");
            }
        }

        public string SearchText
        {
            get => _searchText;
            set
            {
                _searchText = value;
                OnPropertyChanged("SearchText");
                Search();
            }
        }

        private void Search()
        {
            if (_count <= 0)
                return;
            var result = new ObservableCollection<CustomFaculty>();
            if (SearchText.Equals(""))
            {
                CustomFaculties = _tableSearch;
                return;
            }

            foreach (var item in _tableSearch)
            {
                if (item.Name.ToLower().Contains(SearchText.ToLower()) ||
                    item.FullName.ToLower().Contains(SearchText.ToLower()))
                {
                    result.Add(item);
                }
            }

            CustomFaculties = result;
        }

        public AdminFacultyViewModel()
        {
            ObservableCollection<Faculty> facultiesList;
            CustomFaculties = new ObservableCollection<CustomFaculty>();
            _tableSearch = new ObservableCollection<CustomFaculty>();
            _faculty = new Faculty();
            FacultyImage = "../../../Icons/noAvatar.png";
            using (var unitOfWork = new UnitOfWork())
            {
                facultiesList = new ObservableCollection<Faculty>(unitOfWork.FacultyRepository.GetAll().ToList());
            }

            foreach (var faculty in facultiesList)
            {
                CustomFaculties.Add(new CustomFaculty(faculty));
            }

            CopyToSearchTable(CustomFaculties);
            _count = _tableSearch.Count;
        }

        private void CopyToSearchTable(ObservableCollection<CustomFaculty> collection)
        {
            _tableSearch.Clear();
            foreach (var item in collection)
            {
                _tableSearch.Add(item);
            }
        }

        public string FacultyName
        {
            get => _faculty.Name;
            set
            {
                _faculty.Name = value;
                OnPropertyChanged("FacultyName");
            }
        }

        public string FacultyImage
        {
            get => _faculty.ImagePath;
            private set
            {
                _faculty.ImagePath = value;
                OnPropertyChanged("FacultyImage");
            }
        }


        public string FacultyFullName
        {
            get => _faculty.FullName;
            set
            {
                _faculty.FullName = value;
                OnPropertyChanged("FacultyFullName");
            }
        }

        public string NumberOfCourses
        {
            get => _faculty.NumberOfCourses.ToString();
            set
            {
                _faculty.NumberOfCourses = Convert.ToByte(value);
                OnPropertyChanged("NumberOfCourses");
            }
        }

        public RelayCommand AddFaculty =>
            new RelayCommand((obj) =>
            {
                try
                {
                    using (var unitOfWork = new UnitOfWork())
                    {
                        var faculties = unitOfWork.FacultyRepository.GetAll().ToList();
                        if (faculties.Any(x => x.Name == FacultyName) ||
                            faculties.Any(x => x.FullName == FacultyFullName))
                        {
                            MessageBox.Show("Факультет с таким названием уже существует", "Ошибка", MessageBoxButton.OK,
                                MessageBoxImage.Error);
                            return;
                        }

                        _faculty.Id = Guid.NewGuid();
                        unitOfWork.FacultyRepository.Create(_faculty);
                        CustomFaculties.Add(new CustomFaculty(_faculty));
                    }

                    Clear();
                }
                catch (Exception)
                {
                    MessageBox.Show("ошибка при добавлении факультета");
                }
            });

        private void Clear()
        {
            _faculty = new Faculty();
            FacultyImage = "../../../Icons/noAvatar.png";
            FacultyName = "";
            FacultyFullName = "";
            NumberOfCourses = "0";
        }

        public ICommand AddImage => new RelayCommand((obj) =>
        {
            var openFileDialog = new OpenFileDialog
            {
                Filter = "Image files (*.jpg, *.jpeg, *.jpe, *.jfif, *.png) | *.jpg; *.jpeg; *.jpe; *.jfif; *.png"
            };
            if (openFileDialog.ShowDialog() == true)
            {
                FacultyImage = openFileDialog.FileName;
            }
        });


        public ICommand OpenFacultyCommand =>
            new RelayCommand((obj) =>
            {
                if (!(obj is CustomFaculty faculty)) return;
                faculty.BackgroundBrush = Brushes.Transparent;
                UndoRedo.UndoRedoManager.Do(() =>
                {
                    MainNavigation.CurrentPage = "ManageFacultyWorkers";
                    MainNavigation.CurrentFaculty = faculty.Id;
                    ((AdminTeachersPage)MainNavigation.GetPage("AdminTeachers")).DataContext =
                        new AdminTeachersViewModel();
                    ((AdminPage)MainNavigation.GetPage("Admin")).Frame.Navigate(
                        MainNavigation.GetPage("AdminTeachers"));
                });
            });

        // public ICommand SelectFacultyCommand =>
        //     new RelayCommand((obj) =>
        //     {
        //         var faculty = (CustomFaculty)obj;
        //         if (_selectedFaculties.Contains(faculty))
        //         {
        //             _selectedFaculties.Remove(faculty);
        //             faculty.BackgroundBrush = Brushes.Transparent;
        //         }
        //         else
        //         {
        //             _selectedFaculties.Add(faculty);
        //             faculty.BackgroundBrush = (SolidColorBrush)Application.Current.FindResource("SelectedItemBrush");
        //         }
        //
        //         SelectedItemsCount = _selectedFaculties.Count;
        //     });

        // public ICommand DeleteFacultyCommand =>
        //     new RelayCommand((obj) =>
        //     {
        //         using (var unitOfWork = new UnitOfWork())
        //         {
        //             foreach (var item in _selectedFaculties)
        //             {
        //                 
        //                 unitOfWork.FacultyRepository.Delete(item.Id);
        //                 CustomFaculties.Remove(item);
        //             }
        //
        //             _selectedFaculties.Clear();
        //             SelectedItemsCount = 0;
        //         }
        //     });
    }
}