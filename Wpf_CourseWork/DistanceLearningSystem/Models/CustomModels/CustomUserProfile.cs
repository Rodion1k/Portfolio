using System;
using System.Windows.Media;
using DistanceLearningSystem.ViewModels.MainVM;

namespace DistanceLearningSystem.Models.CustomModels
{
    public class CustomUserProfile : ViewModelBase
    {
        public Guid Id { get; set; }
        public string Gender { get; set; }
        public string Name { get; set; }
        public string SurName { get; set; }
        public string Patronymic { get; set; }
        public string ImagePath { get; set; }
        public string Role { get; set; }
        private Brush _backgroundBrush;
        public string Email { get; set; }
        public Brush BackgroundBrush
        {
            get => _backgroundBrush;
            set
            {
                _backgroundBrush = value;
                OnPropertyChanged("BackgroundBrush");
            }
        }
        public CustomUserProfile(UserProfile user)
        {
            Id = user.Id;
            Gender = user.Gender;
            Name = user.Name;
            SurName = user.SurName;
            Patronymic = user.Patronymic;
            ImagePath = user.ImagePath;
            Role = user.Role;
            BackgroundBrush = Brushes.Transparent;
            Email = user.UserLogin.Email;
        }
    }
}