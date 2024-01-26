using System;

namespace DistanceLearningSystem.Models
{
    public static class Account
    {
        public static string Name { get; set; }
        public static string Email { get; set; }
        public static string Password { get; set; }
        public static Guid Id { get; set; }
        public static string Role { get; set; }
        public static string Image { get; set; }
        public static Guid Faculty { get; set; }
        public static Guid Specialty { get; set; }
    }
}