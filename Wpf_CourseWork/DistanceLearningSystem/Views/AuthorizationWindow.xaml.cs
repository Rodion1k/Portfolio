using System;
using System.Linq;
using System.Windows;
using System.Windows.Input;
using DistanceLearningSystem.Navigation;

namespace DistanceLearningSystem.Views
{
    public partial class AuthorizationWindow : Window
    {
        public AuthorizationWindow()
        {
            InitializeComponent();
        }

        private void MainWindowTool_OnMouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ChangedButton == MouseButton.Left)
                DragMove();
        }

        private void MinButton_OnMouseDown(object sender, RoutedEventArgs routedEventArgs)
        {
            WindowState = WindowState.Minimized;
        }

        private void ExitOnMouseDown(object sender, RoutedEventArgs e)
        {
            System.Windows.Application.Current.Shutdown();
        }

        private void ThemeImage_OnMouseDown(object sender, MouseButtonEventArgs e)
        {
            MainNavigation.ChangeTheme();
        }
        
        private void LanguageImage_OnMouseDown(object sender, MouseButtonEventArgs e)
        {
            MainNavigation.ChangeLanguage();
        }
        
      
    }
}