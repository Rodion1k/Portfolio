using System;
using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Input;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.Models;
using DistanceLearningSystem.Navigation;
using DistanceLearningSystem.ViewModels.MainVM;
using DistanceLearningSystem.Views.Pages.Student;

namespace DistanceLearningSystem.ViewModels.StudentVM
{
    public class StudentLecturesViewModel : ViewModelBase
    {
        private ObservableCollection<Lecture> _lectures;
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

        public ObservableCollection<Lecture> Lectures
        {
            get => _lectures;
            private set
            {
                _lectures = value;
                OnPropertyChanged("Lectures");
            }
        }

        public StudentLecturesViewModel()
        {
            using (UnitOfWork unitOfWork = new UnitOfWork())
            {
                Lectures = new ObservableCollection<Lecture>(
                    unitOfWork.LectureRepository.Find(x => x.SubjectId == MainNavigation.CurrentSubject));
                MoonPdfOpacity = 0;
            }
        }

        public ICommand OpenLectureCommand => new RelayCommand((obj) =>
            {
                try
                {
                    if (obj is Lecture lecture)
                    {
                        ((StudentLecturesPage)MainNavigation.GetPage("StudentLectures")).MoonPdfPanel.OpenFile(
                            lecture.FileName);
                        MoonPdfOpacity = 1;
                    }
                }
                catch (Exception)
                {
                    MessageBox.Show("Ошибка открытия лекции");
                }
            }
        );
    }
}