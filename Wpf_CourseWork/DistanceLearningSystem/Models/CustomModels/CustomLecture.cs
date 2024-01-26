using System;
using System.Windows.Media;
using DistanceLearningSystem.ViewModels.MainVM;

namespace DistanceLearningSystem.Models.CustomModels
{
    public class CustomLecture : ViewModelBase
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid SubjectId { get; set; }
        public string FileName { get; set; }
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

        public CustomLecture(Lecture lecture)
        {
            Id = lecture.Id;
            Name = lecture.Name;
            Description = lecture.Description;
            SubjectId = lecture.SubjectId;
            FileName = lecture.FileName;
            BackgroundBrush = Brushes.Transparent;
        }
    }
}