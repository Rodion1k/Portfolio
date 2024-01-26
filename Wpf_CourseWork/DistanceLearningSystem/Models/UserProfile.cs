using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DistanceLearningSystem.Models
{
    public class UserProfile
    {
        [Key] [ForeignKey("UserLogin")] public Guid Id { get; set; }
        public string Gender { get; set; }
        public string Name { get; set; }
        public string SurName { get; set; }
        public string Patronymic { get; set; }
        public string ImagePath { get; set; }
        public Guid? GroupId { get; set; }
        [ForeignKey("GroupId")] public Group Group { get; set; }
        public UserLogin UserLogin { get; set; }
        

        public string Role { get; set; }

        public UserProfile(UserProfile userProfile)
        {
            Id = userProfile.Id;
            Gender = userProfile.Gender;
            Name = userProfile.Name;
            SurName = userProfile.SurName;
            Patronymic = userProfile.Patronymic;
            ImagePath = userProfile.ImagePath;
            Role=userProfile.Role;
        }

        public UserProfile()
        {
        }
        public virtual List<Faculty> Faculties { get; set; } = new List<Faculty>();
    }
}