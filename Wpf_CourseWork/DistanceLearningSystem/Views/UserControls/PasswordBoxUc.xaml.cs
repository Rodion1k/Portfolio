using System.Windows;
using System.Windows.Controls;

namespace DistanceLearningSystem.Views.UserControls
{
    public partial class PasswordBox : UserControl
    {
        public static readonly DependencyProperty PasswordProperty = DependencyProperty.Register("Password",
            typeof(string), typeof(PasswordBox),
            new PropertyMetadata(string.Empty));


        public string Password
        {
            get => (string)GetValue(PasswordProperty);
            set => SetValue(PasswordProperty, value);
        }


        public PasswordBox()
        {
            InitializeComponent();
        }

        private void PasswordBox_OnPasswordChanged(object sender, RoutedEventArgs e)
        {
            Password = passwordBox.Password;
        }
    }
}