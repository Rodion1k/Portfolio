
using DistanceLearningSystem.Navigation;

namespace DistanceLearningSystem.Views.Pages.Teacher
{
    public partial class TeacherPage
    {
        public TeacherPage()
        {
            InitializeComponent();
            MainNavigation.CurrentPage="Subjects";
            Frame.Navigate(new TeacherSubjectsPage());
        }
    }
}