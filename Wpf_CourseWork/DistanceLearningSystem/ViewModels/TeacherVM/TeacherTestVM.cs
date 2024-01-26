using System.Collections.ObjectModel;
using System.Linq;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.Models.CustomModels;
using DistanceLearningSystem.Navigation;
using DistanceLearningSystem.ViewModels.MainVM;

namespace DistanceLearningSystem.ViewModels.TeacherVM
{
    public class TeacherTestViewModel : ViewModelBase
    {
        private ObservableCollection<CustomTestResult> _testResultsList;
        private readonly ObservableCollection<CustomTestResult> _tableSearch;
        private readonly int _count;

        public ObservableCollection<CustomTestResult> TestResultsList
        {
            get => _testResultsList;
            private set
            {
                _testResultsList = value;
                OnPropertyChanged("TestResultsList");
            }
        }

        private string _searchText;

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
            var result = new ObservableCollection<CustomTestResult>();
            if (SearchText.Equals(""))
            {
                TestResultsList = _tableSearch;
                return;
            }

            foreach (var item in _tableSearch)
            {
                if (item.Name.ToLower().Contains(SearchText.ToLower()) ||
                    item.SurName.ToLower().Contains(SearchText.ToLower()) ||
                    item.Patronymic.ToLower().Contains(SearchText.ToLower()) ||
                    item.GroupNumber.ToString().ToLower().Contains(SearchText.ToLower()))
                {
                    result.Add(item);
                }
            }

            TestResultsList = result;
        }

        public TeacherTestViewModel()
        {
            _tableSearch = new ObservableCollection<CustomTestResult>();
            _testResultsList = new ObservableCollection<CustomTestResult>();
            using (var unitOfWork = new UnitOfWork())
            {
                var testResults =
                    unitOfWork.TestsResultsRepository.GetWithInclude(x => x.TestId == MainNavigation.CurrentTest,
                        x => x.UserProfile, x => x.UserProfile.Group);
                foreach (var item in testResults)
                {
                    TestResultsList.Add(new CustomTestResult()
                    {
                        Name = item.UserProfile.Name,
                        SurName = item.UserProfile.SurName,
                        Patronymic = item.UserProfile.Patronymic,
                        GroupNumber = item.UserProfile.Group.Number,
                        Result = item.Mark,
                        ImagePath = item.UserProfile.ImagePath,
                    });
                }
            }

            TestResultsList = new ObservableCollection<CustomTestResult>(TestResultsList.OrderBy(x => x.GroupNumber));

            CopyToSearchTable(TestResultsList);
            _count = _tableSearch.Count;
        }

        private void CopyToSearchTable(ObservableCollection<CustomTestResult> collection)
        {
            _tableSearch.Clear();
            foreach (var item in collection)
            {
                _tableSearch.Add(item);
            }
        }
    }
}