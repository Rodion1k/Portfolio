using System;

namespace DistanceLearningSystem.Models
{
    public class UserLogin
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public UserProfile Profile { get; set; }
        
    }
}