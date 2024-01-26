using System.Windows;
using System.Windows.Controls;
using System.Windows.Media.Imaging;
using DistanceLearningSystem.Animations;

namespace DistanceLearningSystem.Views.Pages.Admin
{
    public partial class FacultiesDataGrid
    {
        private bool _isShowed;

        public FacultiesDataGrid()
        {
            InitializeComponent();
        }

        private void UIElement_OnMouseLeftButtonDown(object sender, RoutedEventArgs e)
        {
            if (_isShowed)
            {
                ScaleGridAnimation.HorizontalScaleGrid(Grid, Grid.ActualWidth, 30, 0.7);
                _isShowed = false;
                DropImage.Source = (BitmapImage)FindResource("ArrowLeftIcon");
            }
            else
            {
                ScaleGridAnimation.HorizontalScaleGrid(Grid, Grid.ActualWidth, 300, 0.7);
                _isShowed = true;
                DropImage.Source = (BitmapImage)FindResource("ArrowRightIcon");
            }
        }


        private void TextBoxBase_OnTextChanged(object sender, TextChangedEventArgs e)
        {
            if (AddButton == null) return;
            if (Validation.ValidationFacultyRule.IsValid(ShortFacultyName.Text) &&
                FullFacultyName.Text.Length > 3 &&
                Validation.ValidationNumericRule.IsValid(FacultyNumeric.Text) && FacultyNumeric.Text != "0")
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