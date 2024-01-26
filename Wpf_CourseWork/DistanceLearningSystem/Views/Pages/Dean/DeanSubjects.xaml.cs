using System.Windows;
using System.Windows.Controls;
using System.Windows.Media.Imaging;
using DistanceLearningSystem.Animations;

namespace DistanceLearningSystem.Views.Pages.Dean
{
    public partial class DeanSubjects
    {
        private bool _isShowed;

        public DeanSubjects()
        {
            InitializeComponent();
        }

        private void UIElement_OnMouseLeftButtonDown(object sender, RoutedEventArgs routedEventArgs)
        {
            if (_isShowed)
            {
                ScaleGridAnimation.HorizontalScaleGrid(Grid, Grid.ActualWidth, 30, 0.9);
                _isShowed = false;
                DropImage.Source = (BitmapImage)FindResource("ArrowLeftIcon");
            }
            else
            {
                ScaleGridAnimation.HorizontalScaleGrid(Grid, Grid.ActualWidth, 300, 0.9);
                _isShowed = true;
                DropImage.Source = (BitmapImage)FindResource("ArrowRightIcon");
            }
        }

        private void TextBoxBase_OnTextChanged(object sender, TextChangedEventArgs e)
        {
            if (AddButton == null) return;
            if (ShortNameTextBox.Text.Length > 1 &&
                FullNameTextBox.Text.Length > 3)
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