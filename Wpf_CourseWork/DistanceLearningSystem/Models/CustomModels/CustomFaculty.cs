using System;
using System.Windows.Media;
using DistanceLearningSystem.ViewModels.MainVM;

namespace DistanceLearningSystem.Models.CustomModels
{
    public class CustomFaculty : ViewModelBase
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string FullName { get; set; }
        public string ImagePath { get; set; }
        public byte NumberOfCourses { get; set; }
        private Brush _backgroundBrush;

        public Brush BackgroundBrush
        {
            get => _backgroundBrush;
            set
            {
                _backgroundBrush = value;
                OnPropertyChanged("BackgroundBrush");
            }
        }

        public CustomFaculty(Faculty faculty)
        {
            Id = faculty.Id;
            Name = faculty.Name;
            FullName = faculty.FullName;
            ImagePath = faculty.ImagePath;
            NumberOfCourses = faculty.NumberOfCourses;
            BackgroundBrush = Brushes.Transparent;
        }
    }
}