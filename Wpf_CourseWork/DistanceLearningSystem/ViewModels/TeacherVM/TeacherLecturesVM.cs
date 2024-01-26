using System;
using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.Models;
using DistanceLearningSystem.Models.CustomModels;
using DistanceLearningSystem.Navigation;
using DistanceLearningSystem.ViewModels.MainVM;
using DistanceLearningSystem.Views.Pages.Teacher;
using Microsoft.Win32;

namespace DistanceLearningSystem.ViewModels.TeacherVM
{
    public class TeacherLecturesViewModel : ViewModelBase
    {
        private ObservableCollection<Lecture> _lectures;
        private ObservableCollection<CustomLecture> _customLectures;
        private readonly ObservableCollection<CustomLecture> _selectedLectures;
        private Lecture _lecture;
        private int _selectedItemsCount;
        private float _moonPdfOpacity;

        public float MoonPdfOpacity
        {
            get => _moonPdfOpacity;
            set
            {
                _moonPdfOpacity = value;
                OnPropertyChanged("MoonPdfOpacity");
            }
        }

        public ObservableCollection<CustomLecture> CustomLectures
        {
            get => _customLectures;
            private set
            {
                _customLectures = value;
                OnPropertyChanged("CustomLectures");
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

        public string Name
        {
            get => _lecture.Name;
            set
            {
                _lecture.Name = value;
                OnPropertyChanged("Name");
            }
        }

        public string Description
        {
            get => _lecture.Description;
            set
            {
                _lecture.Description = value;
                OnPropertyChanged("Description");
            }
        }

        private ObservableCollection<Lecture> Lectures
        {
            get => _lectures;
            set
            {
                _lectures = value;
                OnPropertyChanged("Lectures");
            }
        }

        public TeacherLecturesViewModel()
        {
            _lecture = new Lecture();
            _selectedLectures = new ObservableCollection<CustomLecture>();
            CustomLectures = new ObservableCollection<CustomLecture>();
            using (UnitOfWork unitOfWork = new UnitOfWork())
            {
                Lectures = new ObservableCollection<Lecture>(
                    unitOfWork.LectureRepository.Find(x => x.SubjectId == MainNavigation.CurrentSubject));
            }

            foreach (var lecture in Lectures)
            {
                CustomLectures.Add(new CustomLecture(lecture));
            }

            MoonPdfOpacity = 0;
        }


        public ICommand AddLectureCommand => new RelayCommand((obj) =>
            {
                try
                {
                    OpenFileDialog openFileDialog = new OpenFileDialog
                    {
                        Filter = "PDF files (*.pdf)|*.pdf"
                    };
                    if (openFileDialog.ShowDialog() == true)
                    {
                        _lecture.Id = Guid.NewGuid();
                        _lecture.SubjectId = MainNavigation.CurrentSubject;
                        _lecture.FileName = openFileDialog.FileName;
                        using (UnitOfWork unitOfWork = new UnitOfWork())
                        {
                            unitOfWork.LectureRepository.Create(_lecture);
                        }
                    }

                    CustomLectures.Add(new CustomLecture(_lecture));
                    Clear();
                }
                catch (Exception)
                {
                   MessageBox.Show("Ошибка при добавлении лекции");
                }
            }
        );

        private void Clear()
        {
            _lecture = new Lecture();
            Name = "";
            Description = "";
        }

        public ICommand DeleteLectureCommand => new RelayCommand((obj) =>
            {
                try
                {
                    using (var unitOfWork = new UnitOfWork())
                    {
                        foreach (var lecture in _selectedLectures)
                        {
                            unitOfWork.LectureRepository.Delete(lecture.Id);
                            CustomLectures.Remove(lecture);
                        }
                    }

                    _selectedLectures.Clear();
                    SelectedItemsCount = 0;
                }
                catch (Exception)
                {
                    MessageBox.Show("Не удалось удалить лекцию");
                }
            }
        );

        public ICommand OpenLectureCommand => new RelayCommand((obj) =>
            {
                try
                {
                    if (!(obj is CustomLecture lecture)) return;
                    SelectedItemsCount = 0;
                    foreach (var item in CustomLectures)
                    {
                        item.BackgroundBrush = Brushes.Transparent;
                    }

                    lecture.BackgroundBrush = Brushes.LightGray;
                    ((TeacherLecturesPage)MainNavigation.GetPage("TeacherLectures")).MoonPdfPanel.OpenFile(
                        lecture.FileName);
                    MoonPdfOpacity = 1;
                }
                catch (Exception)
                {
                    MessageBox.Show("Ошибка открытия лекции");
                }
            }
        );

        public ICommand SelectItemCommand => new RelayCommand((obj) =>
        {
            var customLecture = (CustomLecture)obj;
            if (_selectedLectures.Contains(customLecture))
            {
                _selectedLectures.Remove(customLecture);
                customLecture.BackgroundBrush = Brushes.Transparent;
            }
            else
            {
                _selectedLectures.Add(customLecture);
                customLecture.BackgroundBrush = (SolidColorBrush)Application.Current.FindResource("SelectedItemBrush");
            }

            SelectedItemsCount = _selectedLectures.Count;
        });
    }
}