using System.Windows;
using System.Windows.Controls;
using DistanceLearningSystem.Navigation;

namespace DistanceLearningSystem.Views.Pages.Admin
{
    public partial class AdminPage : Page
    {
        public AdminPage()
        {
            InitializeComponent();
            MainNavigation.CurrentPage = "ManageUsers";
            Frame.Navigate(new DeansDataGrid());
            // UndoRedo.UndoRedoManager.Do(() =>
            // {
            //     
            // });
          
        }


        private void DeansButton_OnClick(object sender, RoutedEventArgs e)
        {
            UndoRedo.UndoRedoManager.Do(() =>
            {
                MainNavigation.CurrentPage = "ManageUsers";
                Frame.Navigate(new DeansDataGrid());
            });
        }


        private void FacultiesButton_OnClick(object sender, RoutedEventArgs e)
        {
            UndoRedo.UndoRedoManager.Do(() =>
            {
                MainNavigation.CurrentPage = "ManageFaculties";
                Frame.Navigate(new FacultiesDataGrid());
            });
           
        }


        private void DataBaseButton_OnClick(object sender, RoutedEventArgs e)
        {
            UndoRedo.UndoRedoManager.Do(() =>
            {
                MainNavigation.CurrentPage = "BrowseDatabase";
                Frame.Navigate(new DataBaseDataGrid());
            });
           
        }
    }
}