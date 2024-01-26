using System;
using System.Collections.Generic;
using DistanceLearningSystem.ViewModels.MainVM;

namespace DistanceLearningSystem.Models.CustomModels
{
    public class CustomQuestion : ViewModelBase
    {
        public Guid Id { get; set; }
        public string QuestionText { get; set; }
        public float QuestionMark { get; set; } 
        public ICollection<CustomAnswer> Answers { get; set; } = new List<CustomAnswer>();
        public CustomAnswer SelectedAnswer { get; set; }
        private bool _answersEnabled;

        public bool AnswersEnabled
        {
            get => _answersEnabled;
            set
            {
                _answersEnabled = value;
                OnPropertyChanged("AnswersEnabled");
            }
        }

        public CustomQuestion(Question question)
        {
            Id = question.Id;
            QuestionText = question.QuestionText;
            QuestionMark = question.QuestionMark;
            AnswersEnabled = true;
            foreach (var answer in question.Answers)
            {
                Answers.Add(new CustomAnswer(answer));
            }
        }
    }
}