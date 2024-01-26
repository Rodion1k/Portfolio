using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows.Input;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.Models;
using DistanceLearningSystem.Navigation;
using DistanceLearningSystem.ViewModels.MainVM;
using DistanceLearningSystem.Views.Pages.Dean;

namespace DistanceLearningSystem.ViewModels.DeanVM
{
    public class DeanSubjectViewModel : ViewModelBase
    {
        private ObservableCollection<UserProfile> _users;
        private SubjectsUserProfiles _subjectsUserProfiles;

        public ObservableCollection<UserProfile> UsersList
        {
            get => _users;
            private set
            {
                _users = value;
                OnPropertyChanged("UsersList");
            }
        }

        public DeanSubjectViewModel()
        {
            _subjectsUserProfiles = new SubjectsUserProfiles();
            using (UnitOfWork unitOfWork = new UnitOfWork())
            {
                var teachers = unitOfWork.FacultyRepository
                    .GetWithInclude(x => x.Id == Account.Faculty, n => n.UserProfiles)
                    .FirstOrDefault()
                    ?.UserProfiles.Where(x => x.Role.Equals("Teacher"));
                if (teachers == null)
                    return;
                UsersList = new ObservableCollection<UserProfile>(teachers);
            }
        }


        public ICommand AddToSubjectCommand => new RelayCommand((obj) =>
        {
            _subjectsUserProfiles = new SubjectsUserProfiles();
            var user = (UserProfile)obj; //TODO добавление учителей на разные специальности в одном предмете
            using (var unitOfWork = new UnitOfWork())
            {
                var currentTeacher =
                    unitOfWork.SubjectsUserProfilesRepository.GetWithInclude(
                            x => x.SubjectId == MainNavigation.CurrentSubject, n => n.UserProfile).FirstOrDefault()
                        ?.UserProfile;
                if (currentTeacher == null)
                {
                    var teacher = unitOfWork.UserProfileRepository.Get(user.Id);
                    _subjectsUserProfiles.Id = Guid.NewGuid();
                    _subjectsUserProfiles.SubjectId = MainNavigation.CurrentSubject;
                    _subjectsUserProfiles.UserProfileId = teacher.Id;
                    unitOfWork.SubjectsUserProfilesRepository.Create(_subjectsUserProfiles);
                }
                else
                {
                    if (currentTeacher.Id != user.Id)
                    {
                        var subjUser = unitOfWork.SubjectsUserProfilesRepository.Find(x =>
                                x.SubjectId == MainNavigation.CurrentSubject && x.UserProfileId == currentTeacher.Id)
                            .FirstOrDefault();
                        if (subjUser != null) unitOfWork.SubjectsUserProfilesRepository.Delete(subjUser.Id);
                        var teacher = unitOfWork.UserProfileRepository.Get(user.Id);
                        _subjectsUserProfiles.Id = Guid.NewGuid();
                        _subjectsUserProfiles.SubjectId = MainNavigation.CurrentSubject;
                        _subjectsUserProfiles.UserProfileId = teacher.Id;
                        unitOfWork.SubjectsUserProfilesRepository.Create(_subjectsUserProfiles);
                    }
                }

                UndoRedo.UndoRedoManager.Do(() =>
                {
                    ((GroupsPage)MainNavigation.GetPage("DeanGroups")).DataContext = new DeanGroupsViewModel();
                    ((DeanPage)MainNavigation.GetPage("Dean")).Frame.Navigate(MainNavigation.GetPage("DeanGroups"));
                });
            }
        });
    }
}