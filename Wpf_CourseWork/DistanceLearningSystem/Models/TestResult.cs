using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace DistanceLearningSystem.Models
{
    public class TestResult
    {
        public Guid Id { get; set; }
        public float Mark { get; set; }
        public Guid TestId { get; set; }
        [ForeignKey("TestId")]
        public Test Test { get; set; }
        public Guid UserProfileId { get; set; }
        [ForeignKey("UserProfileId")]
        public UserProfile UserProfile { get; set; }
    }

}
