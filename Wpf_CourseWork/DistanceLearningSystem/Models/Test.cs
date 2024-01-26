using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace DistanceLearningSystem.Models
{
    public class Test
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid SubjectId { get; set; } 
        [ForeignKey("SubjectId")]
        public Subject Subject { get; set; }
        public ICollection<Question> Questions { get; set; }
    }
}