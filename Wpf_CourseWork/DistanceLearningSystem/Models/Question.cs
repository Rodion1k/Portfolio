using System;
using System.Collections.Generic;

namespace DistanceLearningSystem.Models
{
    public class Question
    {
        public Guid Id { get; set; }
        public string QuestionText { get; set; }
        public float QuestionMark { get; set; }
        public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();
    }
}