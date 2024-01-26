using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace DistanceLearningSystem.Models
{
    public class Answer
    {
        public Guid Id { get; set; }
        public string TextAnswer { get; set; }
        public bool IsCorrect { get; set; }
        public Guid QuestionId { get; set; }
        [ForeignKey("QuestionId")]
        public Question Question { get; set; }
    }
}