using System;
using System.Linq;
using System.Windows.Input;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.Models;
using DistanceLearningSystem.Validation;
using DistanceLearningSystem.Views;

namespace DistanceLearningSystem.ViewModels.MainVM
{
    public class AuthorizationWindowViewModel : ViewModelBase
    {
        public AuthorizationWindowViewModel()
        {
            _userLogin = new UserLogin();
        }

        private UserLogin _userLogin;
        //TODO смотреть по мылу есть ли такой чел с таким мылом при регистрации в админе и декане 
        public string Email
        {
            get => _userLogin.Email;
            set
            {
                _userLogin.Email = value;
                OnPropertyChanged("Email");
            }
        }

        public string Password
        {
            get => _userLogin.Password;
            set
            {
                //Error = "";
                _userLogin.Password = value;
                OnPropertyChanged("Password");
            }
        }

        private string _error;


        public string Error
        {
            get => _error;
            private set
            {
                _error = value;
                OnPropertyChanged("Error");
            }
        }

        public ICommand AuthorizationCommand =>
            new RelayCommand(((obj) =>
                {
                    Error = "";
                    UserProfile userProfile;
                    string passwordHash = Encryptor.Encryptor.Encrypt(Password);
                    using (UnitOfWork unitOfWork = new UnitOfWork())
                    {
                        var user = unitOfWork.UserLoginRepository.GetWithInclude(
                            x => x.Email == Email && x.Password.Equals(passwordHash), p => p.Profile).ToList();
                        if (user.Count == 0)
                        {
                            Error = "Неверный логин или пароль\n"; 
                            return;
                        }

                        userProfile = user.First().Profile;
                        var role = userProfile.Role;
                        if (role == null) return;
                        if (role.Equals("Dean"))
                        {
                            var worker = unitOfWork.UserProfileRepository.Get(userProfile.Id).Faculties.First();
                            //TODO если нет факультета в базе, то выводим ошибку
                            Account.Faculty = worker.Id;
                        }
                        else if (role.Equals("Student"))
                        {
                            // Account.Faculty = worker.Id; //TODO 

                            var lol = unitOfWork.GroupRepository.Find(x => x.Id == userProfile.GroupId).FirstOrDefault()
                                ?.SpecialtyId;
                            if (lol != null) Account.Specialty = (Guid)lol;
                        }
                        
                        Account.Id = userProfile.Id;
                        Account.Email = _userLogin.Email;
                        Account.Password = Password;
                        Account.Name = userProfile.Name;
                        Account.Role = role;
                        Account.Image = userProfile.ImagePath;
                        if (_userLogin.Email.Equals("shim@gmail.com")) // для того чтобы сдать 
                        {
                            Account.Email = "rodionvaisera@gmail.com";
                            Account.Password = "Hjlbjydfqcthf19092002";
                        }
                        new MainWindow(role).Show();
                        Close(this);
                    }
                }), (obj) => ValidationPasswordRule.IsValid(Password) && ValidationEmailRule.IsValid(Email)
            );
    }
}