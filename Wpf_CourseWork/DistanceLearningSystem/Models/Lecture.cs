using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace DistanceLearningSystem.Models
{
    public class Lecture
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string FileName { get; set; }
        public Guid SubjectId { get; set; }
        [ForeignKey("SubjectId")]
        public Subject Subject { get; set; }
    }
    
}