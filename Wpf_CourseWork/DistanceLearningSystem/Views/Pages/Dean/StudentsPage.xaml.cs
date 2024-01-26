using System.Windows;
using System.Windows.Controls;
using System.Windows.Media.Imaging;
using DistanceLearningSystem.Animations;

namespace DistanceLearningSystem.Views.Pages.Dean
{
    public partial class StudentsPage
    {
        private bool _isShowed;
        public StudentsPage()
        {
            InitializeComponent();
        }

        private void UIElement_OnMouseLeftButtonDown(object sender, RoutedEventArgs e)
        {
            if(_isShowed)
            {
                ScaleGridAnimation.HorizontalScaleGrid(Grid,Grid.ActualWidth,30,0.7);
                _isShowed = false;
                DropImage.Source = (BitmapImage)FindResource("ArrowLeftIcon");
            }
            else
            {
                ScaleGridAnimation.HorizontalScaleGrid(Grid,Grid.ActualWidth,300,0.7);
                _isShowed = true;
                DropImage.Source = (BitmapImage)FindResource("ArrowRightIcon");
            }
        }

        private void TextBoxBase_OnTextChanged(object sender, TextChangedEventArgs e)
        {
            if (RegisterButton == null) return;
            if (Validation.ValidationEmailRule.IsValid(EmailTextBox.Text)
                && Validation.ValidationPasswordRule.IsValid(PasswordTextBox.Text)
                && Validation.ValidationInitialsRule.IsValid(NameTextBox.Text)
                && Validation.ValidationInitialsRule.IsValid(SurNameTextBox.Text)
                && Validation.ValidationInitialsRule.IsValid(PatronymicTextBox.Text))
            {
                RegisterButton.IsEnabled = true;
            }
            else
            {
                RegisterButton.IsEnabled = false;
            }   
        }
    }
}