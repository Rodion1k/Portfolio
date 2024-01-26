using System;
using System.Windows;
using DistanceLearningSystem.ViewModels.MainVM;

namespace DistanceLearningSystem.Models.CustomModels
{
    public class CustomTest : ViewModelBase
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public float Mark { get; set; }
        private bool _isEnabled;
        private double _opacity;
        private Visibility _visibility;

        public Visibility Visibility
        {
            get => _visibility;
            set
            {
                _visibility = value;
                OnPropertyChanged("Visibility");
            }
        }

        public double Opacity
        {
            get => _opacity;
            set
            {
                _opacity = value;
                OnPropertyChanged("Opacity");
            }
        }

        public bool IsEnabled
        {
            get => _isEnabled;
            set
            {
                _isEnabled = value;
                OnPropertyChanged("IsEnabled");
            }
        }

        public CustomTest(Test test)
        {
            Id = test.Id;
            Name = test.Name;
            Description = test.Description;
            IsEnabled = true;
            Opacity = 1;
            Visibility = Visibility.Hidden;
        }
    }
}