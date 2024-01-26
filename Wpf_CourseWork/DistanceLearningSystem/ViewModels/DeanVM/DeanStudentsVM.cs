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
using DistanceLearningSystem.Navigation;
using DistanceLearningSystem.ViewModels.MainVM;

namespace DistanceLearningSystem.ViewModels.DeanVM
{
    public class DeanStudentsViewModel : ViewModelBase
    {
        private ObservableCollection<CustomUserProfile> _customUsers;
        private readonly ObservableCollection<CustomUserProfile> _tableSearch;
        private readonly ObservableCollection<CustomUserProfile> _selectedUsers;
        private readonly int _count;
        private int _selectedItemsCount;
        private string _searchText;
        private UserProfile _user;
        private UserLogin _userLogin;
        private string _lastGender;
        private string _passwordHash;

        private string _tempPassword;

        public ObservableCollection<CustomUserProfile> CustomUsersList
        {
            get => _customUsers;
            private set
            {
                _customUsers = value;
                OnPropertyChanged("CustomUsersList");
            }
        }

        public string SearchText
        {
            get => _searchText;
            set
            {
                _searchText = value;
                OnPropertyChanged("SearchText");
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
                CustomUsersList = _tableSearch;
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

            CustomUsersList = result;
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


        public DeanStudentsViewModel()
        {
            ObservableCollection<UserProfile> users;
            _user = new UserProfile();
            _tableSearch = new ObservableCollection<CustomUserProfile>();
            _selectedUsers = new ObservableCollection<CustomUserProfile>();
            CustomUsersList = new ObservableCollection<CustomUserProfile>();
            _userLogin = new UserLogin();
            UserImage = "../../../Icons/noAvatar.png";
            using (UnitOfWork unitOfWork = new UnitOfWork())
            {
                users = new ObservableCollection<UserProfile>(
                    unitOfWork.UserProfileRepository.GetWithInclude(
                        x => x.Role.Equals("Student") && x.GroupId == MainNavigation.CurrentGroup,
                        x => x.UserLogin));
            }

            foreach (var user in users)
            {
                CustomUsersList.Add(new CustomUserProfile(user));
            }

            CopyCollection(_tableSearch, CustomUsersList);
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
                        MessageBox.Show("Выберите пол");
                        return;
                    }

                    using (UnitOfWork unitOfWork = new UnitOfWork())
                    {
                        var users = unitOfWork.UserLoginRepository.Find(x => x.Email == UserEmail);
                        if (users.Count() != 0)
                        {
                            MessageBox.Show("Пользователь с таким email уже существует");
                            return;
                        }

                        _user.Id = Guid.NewGuid();
                        _userLogin.Id = _user.Id;
                        _user.Role = "Student";
                        _user.GroupId = MainNavigation.CurrentGroup;
                        _tempPassword = UserPassword;
                        _passwordHash = Encryptor.Encryptor.Encrypt(UserPassword);
                        _userLogin.Password = _passwordHash;
                        unitOfWork.UserLoginRepository.Create(_userLogin);
                        unitOfWork.UserProfileRepository.Create(_user);
                        var customUser = new CustomUserProfile(_user);
                        CustomUsersList.Add(customUser);
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

        private void Clear()
        {
            _lastGender = UserGender;
            _user = new UserProfile();
            _userLogin = new UserLogin();
            UserName = "";
            UserSurName = "";
            UserPatronymic = "";
            UserEmail = "";
            UserPassword = "";
            _passwordHash = "";
            UserImage = "../../../Icons/noAvatar.png";
            UserGender = $": {_lastGender}";
        }

        private void SendEmail()
        {
            var fromAddress = new MailAddress(Account.Email, Account.Name);
            var toAddress = new MailAddress(UserEmail, UserName);
            const string subject = "Registration in Distance Learning System";
            var body =
                $"Dear {UserSurName} {UserName} {UserPatronymic}, you have received registration in the DLC with the role Student. Your login is {UserEmail} and password is {_tempPassword}";
            EmailSender.EmailSender.SendEmail(fromAddress, toAddress, Account.Password, subject, body);
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
                    foreach (var item in _selectedUsers)
                    {
                        var testResults = unitOfWork.TestsResultsRepository.Find(x => x.UserProfileId == item.Id);
                        foreach (var testResult in testResults)
                        {
                            unitOfWork.TestsResultsRepository.Delete(testResult.Id);
                        }

                        unitOfWork.UserProfileRepository.Delete(item.Id);
                        unitOfWork.UserLoginRepository.Delete(item.Id);
                        CustomUsersList.Remove(item);
                        _tableSearch.Remove(item);
                    }
                }

                _selectedUsers.Clear();
                SelectedItemsCount = 0;
            }
            catch (Exception)
            {
                MessageBox.Show("Ошибка при удалении пользователя");
            }
        });
    }
}