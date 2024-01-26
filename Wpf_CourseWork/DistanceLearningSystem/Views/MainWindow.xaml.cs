using System.Windows;
using System.Windows.Input;
using DistanceLearningSystem.Animations;
using DistanceLearningSystem.Navigation;
using DistanceLearningSystem.Views.Pages.Admin;
using DistanceLearningSystem.Views.Pages.Dean;
using DistanceLearningSystem.Views.Pages.Student;
using DistanceLearningSystem.Views.Pages.Teacher;

namespace DistanceLearningSystem.Views
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow
    {
        private bool _isShowed;

        public MainWindow(string role)
        {
            InitializeComponent();
            switch (role)
            {
                case "Admin":
                    MainNavigation.CurrentPage = "ManageUsers";
                    MainFrame.Navigate(MainNavigation.GetPage("Admin"));
                    
                    UndoRedo.UndoRedoManager.Add(() =>
                    {
                        MainNavigation.CurrentPage = "ManageUsers";
                        ((AdminPage)MainNavigation.GetPage("Admin")).Frame.Navigate(
                            MainNavigation.GetPage("AdminUsers"));
                    });
                    break;
                case "Teacher":
                    MainNavigation.CurrentPage="Subjects";
                    MainFrame.Navigate(MainNavigation.GetPage("Teacher"));
                    UndoRedo.UndoRedoManager.Add(() =>
                    {
                        MainNavigation.CurrentPage = "Subjects";
                        ((TeacherPage)MainNavigation.GetPage("Teacher")).Frame.Navigate(
                            MainNavigation.GetPage("TeacherSubjects"));
                    });
                    break;
                case "Student":
                    MainNavigation.CurrentPage = "Subjects";
                    MainFrame.Navigate(MainNavigation.GetPage("Student"));
                    UndoRedo.UndoRedoManager.Add(() =>
                    {
                        MainNavigation.CurrentPage = "Subjects";
                        ((StudentPage)MainNavigation.GetPage("Student")).Frame.Navigate(
                            MainNavigation.GetPage("StudentSubjects"));
                    });
                    break;
                case "Dean":
                    MainNavigation.CurrentPage = "Courses";
                    MainFrame.Navigate(MainNavigation.GetPage("Dean"));
                    UndoRedo.UndoRedoManager.Add(() =>
                    {
                        MainNavigation.CurrentPage = "Courses";
                        ((DeanPage)MainNavigation.GetPage("Dean")).Frame.Navigate(
                            new CursesPage());//TODO mainNavigation.GetPage("DeanCourses"));
                    });
                    break;
            }
        }

        private void MinimizeButton_OnMouseDown(object sender, RoutedEventArgs routedEventArgs)
        {
            this.WindowState = WindowState.Minimized;
        }

        private void MaximizeButton_OnMouseDown(object sender, RoutedEventArgs routedEventArgs)
        {
            this.WindowState = this.WindowState == WindowState.Maximized ? WindowState.Normal : WindowState.Maximized;
        }

        private void CloseButton_OnMouseDown(object sender, RoutedEventArgs routedEventArgs) =>
            Application.Current.Shutdown();

        private void TopGrid_OnMouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ChangedButton == MouseButton.Left)
            {
                this.DragMove();
            }
        }

        private void UIElement_OnMouseLeftButtonDown(object sender, RoutedEventArgs e)
        {
            if (_isShowed)
            {
                ScaleGridAnimation.VerticalScaleGrid(PopupGrid, PopupGrid.ActualHeight, 0, 0.5);
                _isShowed = false;
            }
            else
            {
                ScaleGridAnimation.VerticalScaleGrid(PopupGrid, PopupGrid.ActualHeight, 120, 0.5);
                _isShowed = true;
            }
        }

        private void LanguageImage_OnMouseDown(object sender, MouseButtonEventArgs e)
            => MainNavigation.ChangeLanguage();


        private void ThemeImage_OnMouseDown(object sender, MouseButtonEventArgs e)
            => MainNavigation.ChangeTheme();


        private void Undo_OnMouseDown(object sender, MouseButtonEventArgs e)
            => UndoRedo.UndoRedoManager.Undo();

        private void Redo_OnMouseDown(object sender, MouseButtonEventArgs e)
            => UndoRedo.UndoRedoManager.Redo();
    }
}