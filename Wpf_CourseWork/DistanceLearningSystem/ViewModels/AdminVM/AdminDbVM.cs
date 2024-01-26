using System.Collections.ObjectModel;
using System.Linq;
using System.Windows.Input;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.ViewModels.MainVM;

namespace DistanceLearningSystem.ViewModels.AdminVM
{
    public class AdminDbViewModel : ViewModelBase
    {
        private string _searchTable;
        private ObservableCollection<object> _table;
        private string _searchText;
        private readonly ObservableCollection<object> _tableSearch;

        public ObservableCollection<object> Table
        {
            get => _table;
            private set
            {
                _table = value;
                OnPropertyChanged("Table");
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

        private readonly int _count;

        private void Search()
        {
            string searchColumn;
            switch (_searchTable)
            {
                case "Group":
                    searchColumn = "Number";
                    break;
                case "User":
                    searchColumn = "FIO";
                    break;
                default:
                    searchColumn = "FullName";
                    break;
            }

            if (_count <= 0) return;
            var result = new ObservableCollection<object>();
            if (SearchText.Equals(""))
            {
                Table = _tableSearch;
                //Table = result;
                return;
            }
            foreach (var item in _tableSearch)
            {
                var type = item.GetType();
                if (searchColumn.Equals("FIO"))
                {
                    string fio = "";
                    var name = type.GetProperties().FirstOrDefault(x => x.Name.Equals("Name"))?.GetValue(item)
                        .ToString();
                    var surName = type.GetProperties().FirstOrDefault(x => x.Name.Equals("SurName"))?.GetValue(item)
                        .ToString();
                    var patronymic = type.GetProperties().FirstOrDefault(x => x.Name.Equals("Patronymic"))
                        ?.GetValue(item)
                        .ToString();
                    fio += name + " " + surName + " " + patronymic;
                    if (fio.ToLower().Contains(SearchText.ToLower()))
                        result.Add(item);
                }
                else
                {
                    var properties = type.GetProperties().FirstOrDefault(x => x.Name.Equals(searchColumn));
                    if (properties == null) continue;
                    if (properties.GetValue(item).ToString().ToLower().StartsWith(SearchText.ToLower()))
                        result.Add(item);
                }
            }

            Table = result;
        }

        public AdminDbViewModel()
        {
            _tableSearch = new ObservableCollection<object>();
            _searchTable = "Faculty";
            Table = new ObservableCollection<object>();
            using (UnitOfWork unit = new UnitOfWork())
            {
                Table = new ObservableCollection<object>(unit.FacultyRepository.GetAll());
            }

            CopyToSearchTable(Table);
            _count = _tableSearch.Count;
        }

        private void CopyToSearchTable(ObservableCollection<object> table)
        {
            _tableSearch.Clear();
            foreach (var item in table)
            {
                _tableSearch.Add(item);
            }
        }

        public ICommand ShowFaculties => new RelayCommand((obj) =>
        {
            _searchTable = "Faculty";
            using (UnitOfWork unit = new UnitOfWork())
            {
                Table = new ObservableCollection<object>(unit.FacultyRepository.GetAll());
            }

            CopyToSearchTable(Table);
        });

        public ICommand ShowSpecialities => new RelayCommand((obj) =>
        {
            _searchTable = "Speciality";
            using (UnitOfWork unit = new UnitOfWork())
            {
                Table = new ObservableCollection<object>(unit.SpecialityRepository.GetAll());
            }

            CopyToSearchTable(Table);
        });

        public ICommand ShowGroups => new RelayCommand((obj) =>
        {
            _searchTable = "Group";
            using (UnitOfWork unit = new UnitOfWork())
            {
                Table = new ObservableCollection<object>(unit.GroupRepository.GetAll());
            }

            CopyToSearchTable(Table);
        });

        public ICommand ShowSubjects => new RelayCommand((obj) =>
        {
            _searchTable = "Subject";
            using (UnitOfWork unit = new UnitOfWork())
            {
                Table = new ObservableCollection<object>(unit.SpecialityRepository.GetAll());
            }

            CopyToSearchTable(Table);
        });

        public ICommand ShowUsers => new RelayCommand((obj) =>
        {
            _searchTable = "User";
            using (UnitOfWork unit = new UnitOfWork())
            {
                Table = new ObservableCollection<object>(unit.UserProfileRepository.GetAll());
            }

            CopyToSearchTable(Table);
        });

        public ICommand ShowStudents => new RelayCommand((obj) =>
        {
            _searchTable = "User";
            using (UnitOfWork unit = new UnitOfWork())
            {
                Table = new ObservableCollection<object>(
                    unit.UserProfileRepository.Find(x => x.Role.Equals("Student")));
            }
            CopyToSearchTable(Table);
        });

        public ICommand ShowDeans => new RelayCommand((obj) =>
        {
            _searchTable = "User";
            using (UnitOfWork unit = new UnitOfWork())
            {
                Table = new ObservableCollection<object>(unit.UserProfileRepository.Find(x => x.Role.Equals("Dean")));
            }
            CopyToSearchTable(Table);
        });

        public ICommand ShowTeachers => new RelayCommand((obj) =>
        {
            _searchTable = "User";
            using (UnitOfWork unit = new UnitOfWork())
            {
                Table = new ObservableCollection<object>(
                    unit.UserProfileRepository.Find(x => x.Role.Equals("Teacher")));
            }
            CopyToSearchTable(Table);
        });

        public ICommand ShowAdmins => new RelayCommand((obj) =>
        {
            _searchTable = "User";
            using (UnitOfWork unit = new UnitOfWork())
            {
                Table = new ObservableCollection<object>(unit.UserProfileRepository.Find(x => x.Role.Equals("Admin")));
            }
            CopyToSearchTable(Table);
        });
    }
}