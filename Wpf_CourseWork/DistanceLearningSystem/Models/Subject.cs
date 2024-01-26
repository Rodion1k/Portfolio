using System;
using System.Collections.Generic;

namespace DistanceLearningSystem.Models
{
    public class Subject
    {
        public Guid Id { get; set;}
        public string Name { get; set; }
        public string FullName { get; set; }
        public short Year { get; set; }
        public ICollection<Lecture> Lectures { get; set; }
        public ICollection<Test> Tests { get; set; }
    }
}