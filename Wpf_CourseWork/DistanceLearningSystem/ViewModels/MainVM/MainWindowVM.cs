using System;
using System.Windows;
using System.Windows.Input;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.Models;
using DistanceLearningSystem.Navigation;
using DistanceLearningSystem.UndoRedo;
using Microsoft.Win32;

namespace DistanceLearningSystem.ViewModels.MainVM
{
    public class MainWindowViewModel : ViewModelBase
    {
        private bool _popupStatus;
        private string _imagePath;
        private string _password;
        private string _repeatPassword;
        private string _currentWindow;
        private bool _undoEnabled;
        private bool _redoEnabled;
        private float _undoOpacity;
        private float _redoOpacity;

        public float RedoOpacity
        {
            get => _redoOpacity;
            set
            {
                _redoOpacity = value;
                OnPropertyChanged("RedoOpacity");
            }
        }

        public float UndoOpacity
        {
            get => _undoOpacity;
            set
            {
                _undoOpacity = value;
                OnPropertyChanged("UndoOpacity");
            }
        }

        public bool UndoEnabled
        {
            get => _undoEnabled;
            set
            {
                _undoEnabled = value;
                OnPropertyChanged("UndoEnabled");
            }
        }

        public bool RedoEnabled
        {
            get => _redoEnabled;
            set
            {
                _redoEnabled = value;
                OnPropertyChanged("RedoEnabled");
            }
        }


        public string CurrentWindow
        {
            get => _currentWindow;
            private set
            {
                _currentWindow = value;
                OnPropertyChanged("CurrentWindow");
            }
        }

        public string RepeatPassword
        {
            get => _repeatPassword;
            set
            {
                _repeatPassword = value;
                OnPropertyChanged("RepeatPassword");
            }
        }

        public string Password
        {
            get => _password;
            set
            {
                _password = value;
                OnPropertyChanged("Password");
            }
        }

        public MainWindowViewModel()
        {
            RedoOpacity = 0.5f;
            UndoOpacity = 0.5f;
            UndoEnabled = false;
            RedoEnabled = false;
            Name = Account.Name;
            Role = Account.Role;
            Email = Account.Email;
            Image = Account.Image;
            MainNavigation.PageChanged += ChangePage;
            UndoRedoManager.UndoRedoChanged += UpdateUndoRedoState;
        }

        private void ChangePage(object sender, MainNavigationEventArgs e)
        {
            CurrentWindow = e.PageName;
        }

        private void UpdateUndoRedoState(object sender, UndoRedoEventArgs e)
        {
            if (e.RedoCount == 0)
            {
                RedoOpacity = 0.5f;
                RedoEnabled = false;
            }
            else
            {
                RedoOpacity = 1f;
                RedoEnabled = true;
            }

            if (e.UndoCount == 1)
            {
                UndoOpacity = 0.5f;
                UndoEnabled = false;
            }
            else
            {
                UndoOpacity = 1f;
                UndoEnabled = true;
            }
        }


        public string Name { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }

        public string Image
        {
            get => _imagePath;
            private set
            {
                _imagePath = value;
                OnPropertyChanged("Image");
            }
        }

        public bool PopupStatus
        {
            get => _popupStatus;
            set
            {
                _popupStatus = value;
                OnPropertyChanged("PopupStatus");
            }
        }

        public ICommand ChangeImageCommand => new RelayCommand
        ((obj) =>
            {
                PopupStatus = false;
                // TODO openfile переделать? using
                var openFileDialog = new OpenFileDialog
                {
                    Filter = "Image files (*.jpg, *.jpeg, *.jpe, *.jfif, *.png) | *.jpg; *.jpeg; *.jpe; *.jfif; *.png"
                };
                if (openFileDialog.ShowDialog() != true) return;
                Image = openFileDialog.FileName;
                Account.Image = Image;
                using (UnitOfWork unitOfWork = new UnitOfWork())
                {
                    var user = unitOfWork.UserProfileRepository.Get(Account.Id);
                    user.ImagePath = Image;
                    unitOfWork.UserProfileRepository.Update(user);
                }
            }
        );

        public ICommand ChangePasswordCommand => new RelayCommand((obj) =>
        {
            if (Password != RepeatPassword)
            {
                MessageBox.Show("Passwords do not match");
                return;
            }

            using (UnitOfWork unitOfWork = new UnitOfWork())
            {
                try
                {
                    string passwordHash = Encryptor.Encryptor.Encrypt(Password);
                    var user = unitOfWork.UserLoginRepository.Get(Account.Id);
                    user.Password = passwordHash;
                    unitOfWork.UserLoginRepository.Update(user);
                    PopupStatus = false;
                }
                catch (Exception)
                {
                    MessageBox.Show("Ошибка смены пароля");
                    return;
                }
                Password = "";
                RepeatPassword = "";
                MessageBox.Show("Пароль успешно изменен");
            }
        });

        public ICommand ClosePopupCommand => new RelayCommand((obj) => { PopupStatus = false; });
        public ICommand OpenPopupCommand => new RelayCommand((obj) => { PopupStatus = !PopupStatus; });
    }
}