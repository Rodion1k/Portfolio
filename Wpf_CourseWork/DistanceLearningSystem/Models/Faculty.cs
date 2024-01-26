using System;
using System.Collections.Generic;

namespace DistanceLearningSystem.Models
{
    public sealed class Faculty
    {
        
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string FullName { get; set; }
        public string ImagePath { get; set; }
        public byte NumberOfCourses { get; set; }
        public ICollection<Speciality> Specialities { get; set; }
        public List<UserProfile> UserProfiles { get; set; } = new List<UserProfile>();
    }
}