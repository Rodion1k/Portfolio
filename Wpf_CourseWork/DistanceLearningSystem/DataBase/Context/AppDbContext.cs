using System.Data.Entity;
using DistanceLearningSystem.Models;

namespace DistanceLearningSystem.DataBase.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext() : base("DefaultConnection")
        {
        }

        public DbSet<SubjectSpecialities> SubjectSpecialities { get; set; }
        public DbSet<SubjectsUserProfiles> SubjectsUserProfiles { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Faculty> Faculties { get; set; }
        public DbSet<Lecture> Lectures { get; set; }
        public DbSet<TestResult> TestsResults { get; set; }
        public DbSet<Test> Tests { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Speciality> Specialities { get; set; }
        public DbSet<UserLogin> UserLogins { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //TODO делать млдель БД 

            base.OnModelCreating(modelBuilder);
        }
    }
}