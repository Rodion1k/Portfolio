using System.Windows;
using System.Windows.Controls;
using System.Windows.Media.Imaging;
using DistanceLearningSystem.Animations;
using DistanceLearningSystem.ViewModels.TeacherVM;

namespace DistanceLearningSystem.Views.Pages.Teacher
{
    public partial class TeacherTestsPage
    {
        private bool _isShowed;

        public TeacherTestsPage()
        {
            InitializeComponent();
            TeacherTestsViewModel.OnQestionsChanged += OnCountQuestionChanged;
        }

        private void UIElement_OnMouseLeftButtonDown(object sender, RoutedEventArgs e)
        {
            if (_isShowed)
            {
                ScaleGridAnimation.HorizontalScaleGrid(Grid, Grid.ActualWidth, 30, 1.1);
                _isShowed = false;
                DropImage.Source = (BitmapImage)FindResource("ArrowLeftIcon");
            }
            else
            {
                ScaleGridAnimation.HorizontalScaleGrid(Grid, Grid.ActualWidth, 700, 1.1);
                _isShowed = true;
                DropImage.Source = (BitmapImage)FindResource("ArrowRightIcon");
            }
        }

        private void TestTextBoxes_OnTextChanged(object sender, TextChangedEventArgs e)
        {
            if (AddTestButton == null) return;
            if (TestNameTextBox.Text.Length > 0 && TestDescriptionTextBox.Text.Length > 0 && ListBox2.Items.Count > 0)
            {
                AddTestButton.IsEnabled = true;
            }
            else
            {
                AddTestButton.IsEnabled = false;
            }
        }

        private void QuestionTextBox_OnTextChanged(object sender, TextChangedEventArgs e)
        {
            if (AddQuestionButton == null) return;
            if (QuestionTextBox.Text.Length > 0 && Answer1TextBox.Text.Length > 0 && Answer2TextBox.Text.Length > 0 &&
                Answer3TextBox.Text.Length > 0 && CorrectAnswerTextBox.Text.Length > 0 &&
                !MarkTextBox.Text.Equals("0") && Validation.ValidationNumericRule.IsValid(MarkTextBox.Text))
            {
                AddQuestionButton.IsEnabled = true;
            }
            else
            {
                AddQuestionButton.IsEnabled = false;
            }
        }

        private void OnCountQuestionChanged(object sender, TeacherTestsViewModelEventArgs e)
        {
            if (AddQuestionButton == null) return;
            if (TestNameTextBox.Text.Length > 0 && TestDescriptionTextBox.Text.Length > 0)
                AddTestButton.IsEnabled = e.HasQuestions;
        }
    }
}