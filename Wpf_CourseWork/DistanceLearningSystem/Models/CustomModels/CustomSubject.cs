using System;

namespace DistanceLearningSystem.Models.CustomModels
{
    public class CustomSubject 
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string FullName { get; set; }
        public short Year { get; set; }
        public UserProfile Teacher { get; set; }

        public CustomSubject(Subject subject)
        {
            Id = subject.Id;
            Name = subject.Name;
            FullName = subject.FullName;
            Year = subject.Year;
        }
    }
}