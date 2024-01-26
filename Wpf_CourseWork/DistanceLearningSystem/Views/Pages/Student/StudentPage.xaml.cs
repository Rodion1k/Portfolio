using DistanceLearningSystem.Navigation;

namespace DistanceLearningSystem.Views.Pages.Student
{
    public partial class StudentPage
    {
        public StudentPage()
        {
            InitializeComponent();
            MainNavigation.CurrentPage="Subjects";
            Frame.Navigate(new StudentSubjectsPage());
        }
    }
}