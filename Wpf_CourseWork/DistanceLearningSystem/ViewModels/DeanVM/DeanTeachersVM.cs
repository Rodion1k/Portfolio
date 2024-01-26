using System;
using System.Collections.ObjectModel;
using System.Security.Cryptography;
using System.Windows.Input;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.Models;
using DistanceLearningSystem.ViewModels.MainVM;
using Microsoft.Win32;

namespace DistanceLearningSystem.ViewModels.DeanVM
{
    public class DeanTeachersViewModel:ViewModelBase
    {
        private ObservableCollection<UserProfile> _users;
        private UserProfile _user;
        private UserLogin _userLogin;
        private UserProfile _selectedUser;

        public ObservableCollection<UserProfile> UsersList
        {
            get => _users;
            set
            {
                _users = value;
                OnPropertyChanged("UsersList");
            }
        }

        public DeanTeachersViewModel()
        {
            _user = new UserProfile();
            _userLogin = new UserLogin();
            UserImage = "../../../Icons/noAvatar.png";
            using (UnitOfWork unitOfWork = new UnitOfWork())
            {
                // var kek = unitOfWork.UserProfileRepository.GetWithInclude(x => x.Role.Equals("Student")&&x.GroupId==MainNavagation.CurrentGroup,
                //     x => x.UserLogin);
               
                UsersList = new ObservableCollection<UserProfile>(
                    unitOfWork.UserProfileRepository.GetWithInclude(x => x.Role.Equals("Teacher"),
                        x => x.UserLogin));
            }
        }


        public string UserName
        {
            get => _user.Name;
            set
            {
                _user.Name = value;
                OnPropertyChanged("UserName");
            }
        }

        public string UserSurName
        {
            get => _user.SurName;
            set
            {
                _user.SurName = value;
                OnPropertyChanged("UserSurName");
            }
        }


        public string UserPatronymic
        {
            get => _user.Patronymic;
            set
            {
                _user.Patronymic = value;
                OnPropertyChanged("UserPatronymic");
            }
        }

        public string UserEmail
        {
            get => _userLogin.Email;
            set
            {
                _userLogin.Email = value;
                OnPropertyChanged("UserEmail");
            }
        }

        public string UserGender
        {
            get => _user.Gender;
            set
            {
                _user.Gender = value;
                OnPropertyChanged("UserGender");
            }
        }

        public string UserImage
        {
            get => _user.ImagePath;
            set
            {
                _user.ImagePath = value;
                OnPropertyChanged("UserImage");
            }
        }

        public string UserPassword
        {
            get => _userLogin.Password;
            set
            {
                _userLogin.Password = value;
                OnPropertyChanged("UserPassword");
            }
        }

        public string UserRole
        {
            get => _user.Role;
            set
            {
                _user.Role = value;
                OnPropertyChanged("UserRole");
            }
        }

        public ICommand AddUser =>
            new RelayCommand((obj) =>
            {
                SHA512 shaM = new SHA512Managed();
                using (UnitOfWork unitOfWork = new UnitOfWork())
                {
                    _user.Id = Guid.NewGuid();
                    _userLogin.Id = _user.Id;
                    _user.Role = "Teacher";
                   // _user.GroupId = MainNavagation.CurrentGroup;
                    string passwordHash = shaM.ComputeHash(System.Text.Encoding.UTF8.GetBytes(UserPassword)).ToString();
                    _userLogin.Password = passwordHash;
                    unitOfWork.UserLoginRepository.Create(_userLogin);
                    unitOfWork.UserProfileRepository.Create(_user);
                    _users.Add(_user);
                }
            });

        public ICommand AddImage =>
            new RelayCommand((obj) =>
                {
                    OpenFileDialog openFileDialog = new OpenFileDialog();
                    openFileDialog.Filter =
                        "Image files (*.jpg, *.jpeg, *.jpe, *.jfif, *.png) | *.jpg; *.jpeg; *.jpe; *.jfif; *.png";
                    if (openFileDialog.ShowDialog() == true)
                    {
                        UserImage = openFileDialog.FileName;
                    }
                }
            );

        public ICommand SelectItemCommand => new RelayCommand((obj) =>
        {
            UserProfile user = obj as UserProfile;
            if (user == null) return;
            _selectedUser = user;
        });

        public ICommand DeleteUserCommand => new RelayCommand((obj) =>
        {
            using (UnitOfWork unitOfWork = new UnitOfWork())
            {
                //  unitOfWork.UserLoginRepository.Delete(_selectedUser.Id);
                unitOfWork.UserProfileRepository.Delete(_selectedUser.Id);
                _users.Remove(_selectedUser);
            }
        });
        
    }
}