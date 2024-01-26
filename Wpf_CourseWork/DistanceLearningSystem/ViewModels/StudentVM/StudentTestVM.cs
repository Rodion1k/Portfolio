using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.Models;
using DistanceLearningSystem.Models.CustomModels;
using DistanceLearningSystem.Navigation;
using DistanceLearningSystem.ViewModels.MainVM;
using DistanceLearningSystem.Views.Pages.Student;

namespace DistanceLearningSystem.ViewModels.StudentVM
{
    public class StudentTestViewModel : ViewModelBase
    {
        private readonly ObservableCollection<CustomQuestion> _selectedQuestions;
        public ObservableCollection<CustomQuestion> Questions { get; set; }
        public Test Test { get; set; }
        public int QuestionCount { get; set; }
        private float _result;
        private int _correctCount;
        private int _wrongCount;
        private Visibility _isVisible;
        private bool _buttonEnabled;

        public bool ButtonEnabled
        {
            get => _buttonEnabled;
            set
            {
                _buttonEnabled = value;
                OnPropertyChanged("ButtonEnabled");
            }
        }

        public Visibility IsVisible
        {
            get => _isVisible;
            set
            {
                _isVisible = value;
                OnPropertyChanged("IsVisible");
            }
        }

        public int CorrectCount
        {
            get => _correctCount;
            private set
            {
                _correctCount = value;
                OnPropertyChanged("CorrectCount");
            }
        }

        public int WrongCount
        {
            get => _wrongCount;
            private set
            {
                _wrongCount = value;
                OnPropertyChanged("WrongCount");
            }
        }

        public float Result
        {
            get => _result;
            private set
            {
                _result = value;
                OnPropertyChanged("Result");
            }
        }

        public StudentTestViewModel()
        {
            ButtonEnabled = true;
            IsVisible = Visibility.Hidden;
            Test = new Test();
            _selectedQuestions = new ObservableCollection<CustomQuestion>();
            Questions = new ObservableCollection<CustomQuestion>();
            using (var unitOfWork = new UnitOfWork())
            {
                Test = unitOfWork.TestsRepository.Get(MainNavigation.CurrentTest);
                var collection = unitOfWork.TestsRepository
                    .GetWithInclude(x => x.Id == MainNavigation.CurrentTest, x => x.Questions).FirstOrDefault()
                    ?.Questions;
                if (collection != null)
                {
                    QuestionCount = collection.Count;
                    foreach (var question in collection)
                    {
                        var lol = unitOfWork.QuestionsRepository
                            .GetWithInclude(x => x.Id == question.Id, x => x.Answers).FirstOrDefault();
                        Questions.Add(new CustomQuestion(lol));
                    }
                }
            }
        }

        public ICommand BackCommand => new RelayCommand((obj) =>
        {
            MainNavigation.CurrentPage = "SubjectStudent";
            ((StudentTestsPage)MainNavigation.GetPage("StudentTests")).DataContext =
                new StudentTestsViewModel();
            ((StudentPage)MainNavigation.GetPage("Student")).Frame.Navigate(
                MainNavigation.GetPage("StudentSubject"));
            ((StudentSubjectPage)MainNavigation.GetPage("StudentSubject")).Frame.Navigate(
                MainNavigation.GetPage("StudentTests"));
        });

        public ICommand FinishTestCommand => new RelayCommand((obj) =>
        {
            try
            {
                float points = 0, maxPoints = 0;
                foreach (var question in _selectedQuestions)
                {
                    if (question.SelectedAnswer.IsCorrect)
                    {
                        CorrectCount++;
                        points += question.QuestionMark;
                        Questions.FirstOrDefault(x => x.Id == question.Id).SelectedAnswer.Background = Brushes.Green;
                    }
                    else
                    {
                        WrongCount++;
                        Questions.FirstOrDefault(x => x.Id == question.Id).SelectedAnswer.Background = Brushes.Red;
                    }

                    maxPoints += question.QuestionMark;
                }

                Result = points / maxPoints * 100;
                using (var unitOfWork = new UnitOfWork())
                {
                    if (unitOfWork.TestsResultsRepository
                            .Find(x => x.TestId == MainNavigation.CurrentTest && x.UserProfileId == Account.Id)
                            .Count() !=
                        0)
                    {
                        MessageBox.Show("Вы уже проходили этот тест");
                        ((StudentSubjectPage)MainNavigation.GetPage("StudentSubject")).DataContext =
                            new StudentSubjectViewModel();
                        ((StudentTestsPage)MainNavigation.GetPage("StudentTests")).DataContext =
                            new StudentTestsViewModel();
                        ((StudentPage)MainNavigation.GetPage("Student")).Frame.Navigate(
                            MainNavigation.GetPage("StudentSubject"));
                        return;
                    }

                    unitOfWork.TestsResultsRepository.Create(new TestResult()
                    {
                        Id = Guid.NewGuid(),
                        Mark = Result,
                        TestId = MainNavigation.CurrentTest,
                        UserProfileId = Account.Id,
                    });
                }

                foreach (var question in Questions)
                {
                    question.AnswersEnabled = false;
                }

                ButtonEnabled = false;
                IsVisible = Visibility.Visible;
            }
            catch (Exception)
            {
                MessageBox.Show("Ошибка завершения теста");
            }
        }, (obj) => _selectedQuestions.Count == QuestionCount);

        public ICommand SelectAnswerCommand => new RelayCommand((obj) =>
        {
            var answer = (CustomAnswer)obj;
            var first = _selectedQuestions.FirstOrDefault(x => x.Id == answer.QuestionId);
            if (first != null)
            {
                if (answer.Id != first.SelectedAnswer.Id)
                {
                    Questions.FirstOrDefault(x => x.Id == first.Id).SelectedAnswer.Background = Brushes.Transparent;
                    _selectedQuestions.Remove(first);
                    answer.Background = Brushes.LightSalmon;
                    first.SelectedAnswer = answer;
                    _selectedQuestions.Add(first);
                }
            }
            else
            {
                var question = Questions.FirstOrDefault(x => x.Id == answer.QuestionId);
                if (question == null) return;
                question.SelectedAnswer = answer;
                _selectedQuestions.Add(question);
                answer.Background = Brushes.LightSalmon;
            }
        });
    }
}