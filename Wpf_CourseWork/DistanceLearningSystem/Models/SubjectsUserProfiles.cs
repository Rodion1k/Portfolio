using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace DistanceLearningSystem.Models
{
    public class SubjectsUserProfiles
    {
        public Guid Id{ get; set; }
        public Guid? SubjectId { get; set; }
        [ForeignKey("SubjectId")]
        public Subject Subject { get; set; }
        public Guid? UserProfileId { get; set; }
        [ForeignKey("UserProfileId")]
        public UserProfile UserProfile { get; set; }
    }
}