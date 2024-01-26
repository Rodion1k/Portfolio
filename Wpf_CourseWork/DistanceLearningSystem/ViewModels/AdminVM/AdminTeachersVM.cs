using System.Collections.ObjectModel;
using System.Data.Entity;
using System.Linq;
using System.Windows;
using System.Windows.Input;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.DataBase.Context;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.Models;
using DistanceLearningSystem.Navigation;
using DistanceLearningSystem.ViewModels.MainVM;

namespace DistanceLearningSystem.ViewModels.AdminVM
{
    public class AdminTeachersViewModel : ViewModelBase
    {
        private ObservableCollection<UserProfile> _users;
        private ObservableCollection<UserProfile> _facultyUsers;
        private readonly ObservableCollection<UserProfile> _facultyTableSearch;
        private readonly ObservableCollection<UserProfile> _allTableSearch;
        private UserProfile _user;
        private string _facultySearchText;
        private string _allSearchText;
        private readonly int _facultyCount;
        private readonly int _allCount;

        public string FacultySearchText
        {
            get => _facultySearchText;
            set
            {
                _facultySearchText = value;
                OnPropertyChanged("FacultySearchText");
                FacultySearch();
            }
        }

        public string AllSearchText
        {
            get => _allSearchText;
            set
            {
                _allSearchText = value;
                OnPropertyChanged("AllSearchText");
                AllSearch();
            }
        }

        private void AllSearch()
        {
            if (_allCount <= 0)
                return;
            var result = new ObservableCollection<UserProfile>();
            if (AllSearchText.Equals(""))
            {
                UsersList = _allTableSearch;
                return;
            }

            foreach (var item in _allTableSearch)
            {
                if (item.Name.ToLower().Contains(AllSearchText.ToLower()) ||
                    item.SurName.ToLower().Contains(AllSearchText.ToLower()) ||
                    item.Patronymic.ToLower().Contains(AllSearchText.ToLower()))
                {
                    result.Add(item);
                }

                UsersList = result; // TODO сделать один метод для поиска в этом VM 
            }
        }

        private void FacultySearch()
        {
            if (_facultyCount <= 0)
                return;
            var result = new ObservableCollection<UserProfile>();
            if (FacultySearchText.Equals(""))
            {
                CopyCollection(FacultyUsersList, _facultyTableSearch);
                //FacultyUsersList = _facultyTableSearch;
                return;
            }

            foreach (var item in _facultyTableSearch)
            {
                if (item.Name.ToLower().Contains(FacultySearchText.ToLower()) ||
                    item.SurName.ToLower().Contains(FacultySearchText.ToLower()) ||
                    item.Patronymic.ToLower().Contains(FacultySearchText.ToLower()))
                {
                    result.Add(item);
                }

                FacultyUsersList = result; // TODO сделать один метод для поиска в этом VM 
            }
        }

        public ObservableCollection<UserProfile> FacultyUsersList
        {
            get => _facultyUsers;
            private set
            {
                _facultyUsers = value;
                OnPropertyChanged("FacultyUsersList");
            }
        }

        public ObservableCollection<UserProfile> UsersList
        {
            get => _users;
            private set
            {
                _users = value;
                OnPropertyChanged("UsersList");
            }
        }

        public AdminTeachersViewModel()
        {
            _allTableSearch = new ObservableCollection<UserProfile>();
            _facultyTableSearch = new ObservableCollection<UserProfile>();
            _user = new UserProfile();
            UserImage = "../../../Icons/noAvatar.png";
            using (UnitOfWork unitOfWork = new UnitOfWork())
            {
                UsersList = new ObservableCollection<UserProfile>(
                    unitOfWork.UserProfileRepository.GetWithInclude(
                        x => x.Role.Equals("Teacher") || x.Role.Equals("Dean"), n => n.UserLogin));
                var faculty = unitOfWork.FacultyRepository
                    .GetWithInclude(x => x.Id == MainNavigation.CurrentFaculty, n => n.UserProfiles)
                    .FirstOrDefault();
                if (faculty == null)
                    return;
                FacultyUsersList = new ObservableCollection<UserProfile>(faculty.UserProfiles);
                CopyCollection(_allTableSearch, UsersList);
                CopyCollection(_facultyTableSearch, FacultyUsersList);
                _facultyCount = _facultyTableSearch.Count;
                _allCount = _allTableSearch.Count;
            }
        }

        private void CopyCollection(ObservableCollection<UserProfile> firstCollection,
            ObservableCollection<UserProfile> secondCollection)
        {
            firstCollection.Clear();
            foreach (var item in secondCollection)
            {
                firstCollection.Add(item);
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

        public ICommand AddToFacultyCommand => new RelayCommand((obj) =>
        {
            UserProfile user = obj as UserProfile;
            if (user == null) return;
            if (FacultyUsersList.Count(x => x.Id == user.Id) != 0)
            {
                MessageBox.Show("Уже есть такой");
                return;
            }

            using (UnitOfWork unitOfWork = new UnitOfWork())
            {
                var worker = unitOfWork.UserProfileRepository.Get(user.Id);
                unitOfWork.FacultyRepository.Get(MainNavigation.CurrentFaculty).UserProfiles.Add(worker);
                unitOfWork.Save();
            }

            FacultyUsersList.Add(user);
            _facultyTableSearch.Add(user);
        });

        public ICommand DeleteFromFacultyCommand => new RelayCommand((obj) =>
        {
            /////return;
            UserProfile user = obj as UserProfile;
            if (user == null) return;
            using (var context = new AppDbContext())
            {
                var faculty = context.Faculties.Include(x => x.UserProfiles)
                    .FirstOrDefault(x => x.Id == MainNavigation.CurrentFaculty);
                if (faculty == null) return;
                var userProfile = faculty.UserProfiles.FirstOrDefault(x => x.Id == user.Id);
                if (userProfile == null) return;
                faculty.UserProfiles.Remove(userProfile);
                context.SaveChanges();
            }

            FacultyUsersList.Remove(user);
            _facultyTableSearch.Remove(user);
        });
    }
}