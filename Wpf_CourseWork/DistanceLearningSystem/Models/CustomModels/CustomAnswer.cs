using System;
using System.Windows.Media;
using DistanceLearningSystem.ViewModels.MainVM;

namespace DistanceLearningSystem.Models.CustomModels
{
    public class CustomAnswer : ViewModelBase
    {
        public Guid Id { get; set; }
        public string TextAnswer { get; set; }
        public bool IsCorrect { get; set; }
        public bool IsSelected { get; set; }
        public Guid QuestionId { get; set; }
        private Brush _background;

        public Brush Background
        {
            get => _background;
            set
            {
                _background = value;
                OnPropertyChanged("Background");
            }
        }

        public CustomAnswer(Answer answer)
        {
            Id = answer.Id;
            TextAnswer = answer.TextAnswer;
            IsCorrect = answer.IsCorrect;
            QuestionId = answer.QuestionId;
            Background = Brushes.Transparent;
        }
    }
}