using DistanceLearningSystem.Navigation;

namespace DistanceLearningSystem.Views.Pages.Dean
{
    public partial class DeanPage
    {
        public DeanPage()
        {
            InitializeComponent();
            MainNavigation.CurrentPage = "Courses";
            Frame.Navigate(new CursesPage());
        }
    }
}