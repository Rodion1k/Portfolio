using System.Windows;
using System.Windows.Controls;
using System.Windows.Media.Imaging;
using DistanceLearningSystem.Animations;

namespace DistanceLearningSystem.Views.Pages.Dean
{
    public partial class GroupsPage
    {
        private bool _isShowed;
        public GroupsPage()
        {
            InitializeComponent();
            
        }


        private void UIElement_OnMouseLeftButtonDown(object sender, RoutedEventArgs e)
        {
            if(_isShowed)
            {
                ScaleGridAnimation.VerticalScaleGrid(Grid,Grid.ActualHeight,30,0.7);
                _isShowed = false;
                DropImage.Source = (BitmapImage)FindResource("ArrowUpIcon");
            }
            else
            {
                ScaleGridAnimation.VerticalScaleGrid(Grid,Grid.ActualHeight,120,0.7);
                _isShowed = true;
                DropImage.Source = (BitmapImage)FindResource("ArrowDownIcon");
            }
        }
        private void TextBoxBase_OnTextChanged(object sender, TextChangedEventArgs e)
        {
            if (AddButton == null) return;
            if (Validation.ValidationNumericRule.IsValid(NumberTextBox.Text))
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