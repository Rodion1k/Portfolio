using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace DistanceLearningSystem.Models
{
    public class Speciality
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string FullName { get; set; }
        public Guid? FacultyId { get; set; }
        [ForeignKey("FacultyId")]
        public  Faculty Faculty { get; set; }
        public ICollection<Group> Groups { get; set; }
        
    }
}