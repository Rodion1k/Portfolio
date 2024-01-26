using System.Windows;
using System.Windows.Controls;
using System.Windows.Media.Imaging;
using DistanceLearningSystem.Animations;

namespace DistanceLearningSystem.Views.Pages.Teacher
{
    public partial class TeacherLecturesPage
    {
        private bool _isShowed;

        public TeacherLecturesPage()
        {
            InitializeComponent();
        }

        private void UIElement_OnMouseLeftButtonDown(object sender, RoutedEventArgs e)
        {
            if (_isShowed)
            {
                ScaleGridAnimation.VerticalScaleGrid(Grid, Grid.ActualHeight, 25, 0.7);
                _isShowed = false;
                DropImage.Source = (BitmapImage)FindResource("ArrowDownIcon");
            }
            else
            {
                ScaleGridAnimation.VerticalScaleGrid(Grid, Grid.ActualHeight, 145, 0.7);
                _isShowed = true;
                DropImage.Source = (BitmapImage)FindResource("ArrowUpIcon");
            }
        }

        private void DescriptionTextBox_OnTextChanged(object sender, TextChangedEventArgs e)
        {
            if (AddButton == null) return;
            if (DescriptionTextBox.Text.Length > 0 && NameTextBox.Text.Length > 0)
            {
                AddButton.IsEnabled = true;
            }
            else
            {
                AddButton.IsEnabled = false;
            }
        }
    }
}