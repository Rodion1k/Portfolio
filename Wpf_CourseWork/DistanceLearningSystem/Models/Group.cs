using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;


namespace DistanceLearningSystem.Models
{
    public sealed class Group
    {
        public Guid Id { get; set; }
        public int Number { get; set; }
        public Guid SpecialtyId { get; set; }
        [ForeignKey("SpecialtyId")]
        public Speciality Speciality { get; set; }
        public short Year { get; set; }
        public ICollection<UserProfile> UserProfiles { get; set; }
    }
}