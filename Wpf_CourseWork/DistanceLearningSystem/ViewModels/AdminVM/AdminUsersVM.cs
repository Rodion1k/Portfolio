using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net.Mail;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.Models;
using DistanceLearningSystem.Models.CustomModels;
using DistanceLearningSystem.ViewModels.MainVM;

namespace DistanceLearningSystem.ViewModels.AdminVM
{
    public class AdminDeansViewModel : ViewModelBase
    {
        private ObservableCollection<CustomUserProfile> _customUsers;
        private UserProfile _user;
        private UserLogin _userLogin;
        private readonly ObservableCollection<CustomUserProfile> _tableSearch;
        private readonly ObservableCollection<CustomUserProfile> _selectedUsers;
        private readonly string _defImage;
        private string _lastRole;
        private int _selectedItemsCount;
        private string _lastGender;
        private string _searchText;
        private readonly int _count;
        private string _tempPassword;


        public ObservableCollection<CustomUserProfile> CustomUserProfiles
        {
            get => _customUsers;
            private set
            {
                _customUsers = value;
                OnPropertyChanged("CustomUserProfiles");
            }
        }

        public int SelectedItemsCount
        {
            get => _selectedItemsCount;
            set
            {
                _selectedItemsCount = value;
                OnPropertyChanged("SelectedItemsCount");
            }
        }

        public string SearchText
        {
            get => _searchText;
            set
            {
                _searchText = value;
                OnPropertyChanged("Text");
                Search();
            }
        }

        private void Search()
        {
            if (_count <= 0)
                return;
            var result = new ObservableCollection<CustomUserProfile>();
            if (SearchText.Equals(""))
            {
                CustomUserProfiles = _tableSearch;
                return;
            }

            foreach (var item in _tableSearch)
            {
                if (item.Name.ToLower().Contains(SearchText.ToLower()) ||
                    item.SurName.ToLower().Contains(SearchText.ToLower()) ||
                    item.Patronymic.ToLower().Contains(SearchText.ToLower()))
                {
                    result.Add(item);
                }
            }

            CustomUserProfiles = result;
        }

        public AdminDeansViewModel()
        {
            ObservableCollection<UserProfile> users;
            _tableSearch = new ObservableCollection<CustomUserProfile>();
            CustomUserProfiles = new ObservableCollection<CustomUserProfile>();
            _selectedUsers = new ObservableCollection<CustomUserProfile>();
            _user = new UserProfile();
            _userLogin = new UserLogin();
            _defImage = "../../../Icons/noAvatar.png";
            UserImage = _defImage;
            using (UnitOfWork unitOfWork = new UnitOfWork())
            {
                users = new ObservableCollection<UserProfile>(
                    unitOfWork.UserProfileRepository.GetWithInclude(x => x.Id != Account.Id, p => p.UserLogin));
            }

            foreach (var user in users)
            {
                CustomUserProfiles.Add(new CustomUserProfile(user));
            }

            CopyCollection(_tableSearch, CustomUserProfiles);
            _count = _tableSearch.Count;
        }

        private void CopyCollection(ObservableCollection<CustomUserProfile> firstCollection,
            ObservableCollection<CustomUserProfile> secondCollection)
        {
            firstCollection.Clear();
            foreach (var item in secondCollection)
            {
                firstCollection.Add(item);
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
                if (!value.Contains(":"))
                    return;
                var temp = value.Remove(0, value.IndexOf(':') + 2);
                string gender = "";
                switch (temp[0])
                {
                    case 'm':
                    case 'м':
                        gender += 'м';
                        break;
                    case 'f':
                    case 'ж':
                        gender += 'ж';
                        break;
                }

                _user.Gender = gender;
                OnPropertyChanged("UserGender");
            }
        }

        public string UserRole
        {
            get => _user.Role;
            set
            {
                if (!value.Contains(":"))
                    return;
                var temp = value.Remove(0, value.IndexOf(':') + 2);
                string role = "";
                switch (temp)
                {
                    case "Администратор":
                    case "Admin":
                        role = "Admin";
                        break;
                    case "Декан":
                    case "Dean":
                        role = "Dean";
                        break;
                    case "Преподаватель":
                    case "Teacher":
                        role = "Teacher";
                        break;
                    case "Студент":
                    case "Student":
                        role = "Student";
                        break;
                }

                _user.Role = role;
                OnPropertyChanged("UserRole");
            }
        }

        private string UserImage
        {
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


        public ICommand AddUser =>
            new RelayCommand((obj) =>
            {
                try
                {
                    if (_user.Gender == null)
                    {
                        MessageBox.Show("Выберите гендер");
                        return;
                    }

                    if (_user.Role == null)
                    {
                        MessageBox.Show("Выберите роль");
                        return;
                    }

                    using (UnitOfWork unitOfWork = new UnitOfWork())
                    {
                        var users = unitOfWork.UserLoginRepository.Find(x => x.Email == UserEmail);
                        if (users.Count() != 0)
                        {
                            MessageBox.Show("Пользователь с таким Email уже существует");
                            return;
                        }

                        _user.Id = Guid.NewGuid();
                        _userLogin.Id = _user.Id;
                        var passwordHash = Encryptor.Encryptor.Encrypt(UserPassword);
                        _tempPassword = UserPassword;
                        _userLogin.Password = passwordHash;
                        unitOfWork.UserLoginRepository.Create(_userLogin);
                        unitOfWork.UserProfileRepository.Create(_user);
                        var customUser = new CustomUserProfile(_user);
                        CustomUserProfiles.Add(customUser);
                        _tableSearch.Add(customUser);
                        SendEmail();
                    }

                    Clear();
                }
                catch (Exception)
                {
                    MessageBox.Show("Ошибка при добавлении пользователя");
                }
            });

        private void SendEmail()
        {
            var fromAddress = new MailAddress(Account.Email, Account.Name);
            var toAddress = new MailAddress(UserEmail, UserName);
            const string subject = "Registration in Distance Learning System";
            var body =
                $"Dear {UserSurName} {UserName} {UserPatronymic}, you have received registration in the DLC with the role Student. Your login: {UserEmail}, password: {_tempPassword}";
            EmailSender.EmailSender.SendEmail(fromAddress, toAddress, Account.Password, subject, body);
        }

        private void Clear()
        {
            _lastGender = UserGender;
            _lastRole = UserRole;
            _user = new UserProfile();
            _userLogin = new UserLogin();
            UserName = "";
            UserSurName = "";
            UserPatronymic = "";
            UserEmail = "";
            UserPassword = "";
            UserRole = $": {_lastRole}";
            UserGender = $": {_lastGender}";
            UserImage = _defImage;
        }

        public ICommand SelectItemCommand => new RelayCommand((obj) =>
        {
            var user = (CustomUserProfile)obj;
            if (_selectedUsers.Contains(user))
            {
                _selectedUsers.Remove(user);
                user.BackgroundBrush = Brushes.Transparent;
            }
            else
            {
                _selectedUsers.Add(user);
                user.BackgroundBrush = (SolidColorBrush)Application.Current.FindResource("SelectedItemBrush");
            }

            SelectedItemsCount = _selectedUsers.Count;
        });

        public ICommand DeleteUserCommand => new RelayCommand((obj) =>
        {
            try
            {
                using (UnitOfWork unitOfWork = new UnitOfWork())
                {
                    foreach (var userProfile in _selectedUsers)
                    {
                        switch (userProfile.Role)
                        {
                            case "Student":
                                var testResults =
                                    unitOfWork.TestsResultsRepository.Find(x => x.UserProfileId == userProfile.Id);
                                foreach (var item in testResults)
                                {
                                    unitOfWork.TestsResultsRepository.Delete(item.Id);
                                }

                                break;
                            case "Teacher":
                                var subjectUsers =
                                    unitOfWork.SubjectsUserProfilesRepository.Find(x =>
                                        x.UserProfileId == userProfile.Id);
                                foreach (var item in subjectUsers)
                                {
                                    unitOfWork.SubjectsUserProfilesRepository.Delete(item.Id);
                                }

                                break;
                        }

                        unitOfWork.UserProfileRepository.Delete(userProfile.Id);
                        unitOfWork.UserLoginRepository.Delete(userProfile.Id);
                        CustomUserProfiles.Remove(userProfile);
                        _tableSearch.Remove(userProfile);
                    }

                    _selectedUsers.Clear();
                    SelectedItemsCount = 0;
                }
            }
            catch (Exception)
            {
                MessageBox.Show("Ошибка при удалении пользователя");
            }
        });
    }
}