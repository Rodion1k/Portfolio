using System;
using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Input;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.Models;
using DistanceLearningSystem.Navigation;
using DistanceLearningSystem.ViewModels.MainVM;
using DistanceLearningSystem.Views.Pages.Teacher;

namespace DistanceLearningSystem.ViewModels.TeacherVM
{
    public class TeacherTestsViewModelEventArgs
    {
        public bool HasQuestions { get; set; }
    }
    
    public class TeacherTestsViewModel : ViewModelBase
    {
        public delegate void TeacherTestsViewModelEventHandler(object sender, TeacherTestsViewModelEventArgs e);
        public static event TeacherTestsViewModelEventHandler OnQestionsChanged;
        private ObservableCollection<Test> _tests;
        private ObservableCollection<Question> _questions;
        private Test _test;
        private Question _question;
        private Answer _firstAnswer;
        private Answer _secondAnswer;
        private Answer _thirdAnswer;
        private Answer _correctAnswer;

        public ObservableCollection<Question> Questions
        {
            get => _questions;
            private set
            {
                _questions = value;
                OnPropertyChanged("Questions");
            }
        }


        public ObservableCollection<Test> TestsList
        {
            get => _tests;
            private set
            {
                _tests = value;
                OnPropertyChanged("TestsList");
            }
        }

        public string FirstAnswer
        {
            get => _firstAnswer.TextAnswer;
            set
            {
                _firstAnswer.TextAnswer = value;
                OnPropertyChanged("FirstAnswer");
            }
        }

        public string SecondAnswer
        {
            get => _secondAnswer.TextAnswer;
            set
            {
                _secondAnswer.TextAnswer = value;
                OnPropertyChanged("SecondAnswer");
            }
        }

        public string ThirdAnswer
        {
            get => _thirdAnswer.TextAnswer;
            set
            {
                _thirdAnswer.TextAnswer = value;
                OnPropertyChanged("ThirdAnswer");
            }
        }

        public string CorrectAnswer
        {
            get => _correctAnswer.TextAnswer;
            set
            {
                _correctAnswer.TextAnswer = value;
                OnPropertyChanged("CorrectAnswer");
            }
        }

        public string Name
        {
            get => _test.Name;
            set
            {
                _test.Name = value;
                OnPropertyChanged("Name");
            }
        }

        public string Description
        {
            get => _test.Description;
            set
            {
                _test.Description = value;
                OnPropertyChanged("Description");
            }
        }

        public string QuestionText
        {
            get => _question.QuestionText;
            set
            {
                _question.QuestionText = value;
                OnPropertyChanged("QuestionText");
            }
        }

        public float QuestionMark
        {
            get => _question.QuestionMark;
            set
            {
                _question.QuestionMark = value;
                OnPropertyChanged("QuestionMark");
            }
        }

        public TeacherTestsViewModel()
        {
            _firstAnswer = new Answer();
            _secondAnswer = new Answer();
            _thirdAnswer = new Answer();
            _correctAnswer = new Answer();
            _question = new Question();
            _test = new Test();
            TestsList = new ObservableCollection<Test>();
            _questions = new ObservableCollection<Question>();
            using (var unitOfWork = new UnitOfWork())
            {
                TestsList = new ObservableCollection<Test>(
                    unitOfWork.TestsRepository.Find(x => x.SubjectId == MainNavigation.CurrentSubject));
            }
        }

        public ICommand AddTest =>
            new RelayCommand((obj) =>
            {
                try
                {
                    _test.Id = Guid.NewGuid();
                    _test.SubjectId = MainNavigation.CurrentSubject;
                    _test.Questions = Questions;
                    using (var unitOfWork = new UnitOfWork())
                    {
                        unitOfWork.TestsRepository.Create(_test);
                    }

                    TestsList.Add(_test);
                    Clear();
                }
                catch (Exception)
                {
                  MessageBox.Show("Ошибка при добавлении теста");
                }
            });

        private void Clear()
        {
            OnQestionsChanged?.Invoke(null,new TeacherTestsViewModelEventArgs(){HasQuestions = false});
            _test = new Test();
            Name = "";
            Description = "";
            Questions = new ObservableCollection<Question>();
        }

        public ICommand AddQuestionCommand =>
            new RelayCommand((obj) =>
            {
                _firstAnswer.IsCorrect = false;
                _secondAnswer.IsCorrect = false;
                _thirdAnswer.IsCorrect = false;
                _correctAnswer.IsCorrect = true;
                _firstAnswer.Id = Guid.NewGuid();
                _secondAnswer.Id = Guid.NewGuid();
                _thirdAnswer.Id = Guid.NewGuid();
                _correctAnswer.Id = Guid.NewGuid();
                _question.Id = Guid.NewGuid();
                _question.Answers.Add(_firstAnswer);
                _question.Answers.Add(_secondAnswer);
                _question.Answers.Add(_thirdAnswer);
                _question.Answers.Add(_correctAnswer);
                Questions.Add(_question);
                ClearQuestion();
                OnQestionsChanged?.Invoke(null,new TeacherTestsViewModelEventArgs(){HasQuestions = true});
            });

        private void ClearQuestion()
        {
            _question = new Question();
            _firstAnswer = new Answer();
            _secondAnswer = new Answer();
            _thirdAnswer = new Answer();
            _correctAnswer = new Answer();
            FirstAnswer = "";
            SecondAnswer = "";
            ThirdAnswer = "";
            CorrectAnswer = "";
            QuestionText = "";
        }

        public ICommand OpenTestCommand =>
            new RelayCommand((obj) =>
            {
                var test = (Test)obj;
                UndoRedo.UndoRedoManager.Do(() =>
                {
                    MainNavigation.CurrentPage = "Results";
                    MainNavigation.CurrentTest = test.Id;
                    ((TeacherTest)MainNavigation.GetPage("TeacherTest")).DataContext = new TeacherTestViewModel();
                    ((TeacherSubjectPage)MainNavigation.GetPage("TeacherSubject")).Frame.Navigate(
                        MainNavigation.GetPage("TeacherTest"));
                });
            });
    }
}