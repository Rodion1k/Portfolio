using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows;
using System.Windows.Input;
using DistanceLearningSystem.Commands;
using DistanceLearningSystem.DataBase.UnitOfWork;
using DistanceLearningSystem.Models;
using DistanceLearningSystem.Navigation;
using DistanceLearningSystem.ViewModels.MainVM;
using DistanceLearningSystem.Views.Pages.Dean;

namespace DistanceLearningSystem.ViewModels.DeanVM
{
    public class DeanSpecialityViewModel : ViewModelBase
    {
        private ObservableCollection<Speciality> _specialities;
        private Speciality _speciality;
        
        public ObservableCollection<Speciality> SpecialityList
        {
            get => _specialities;
            private set
            {
                _specialities = value;
                OnPropertyChanged("FacultiesList");
            }
        }

        public DeanSpecialityViewModel()
        {
            _speciality = new Speciality();

            using (UnitOfWork unitOfWork = new UnitOfWork())
            {
                SpecialityList =
                    new ObservableCollection<Speciality>(
                        unitOfWork.SpecialityRepository.Find(x => x.FacultyId == Account.Faculty));
            }
        }

        public string SpecialityName
        {
            get => _speciality.Name;
            set
            {
                _speciality.Name = value;
                OnPropertyChanged("SpecialityName");
            }
        }

        public string SpecialityFullName
        {
            get => _speciality.FullName;
            set
            {
                _speciality.FullName = value;
                OnPropertyChanged("SpecialityFullName");
            }
        }

        public ICommand AddSpeciality =>
            new RelayCommand((obj) =>
            {
                using (UnitOfWork unitOfWork = new UnitOfWork())
                {
                    var specialities = unitOfWork.SpecialityRepository.Find(x => x.FacultyId == Account.Faculty)
                        .Any(x => x.Name == SpecialityName || x.FullName == SpecialityFullName);
                    if (specialities)
                    {
                        MessageBox.Show("Такая специальность уже существует");
                        return;
                    }

                    _speciality.Id = Guid.NewGuid();
                    _speciality.FacultyId = Account.Faculty;
                    unitOfWork.SpecialityRepository.Create(_speciality);
                    _specialities.Add(_speciality);
                }
                Clear();
            });

        private void Clear()
        {
            _speciality = new Speciality();
            SpecialityName = "";
            SpecialityFullName = "";
        }

        public ICommand OpenSpecCommand => new RelayCommand((obj) =>
        {
            var spec = (Speciality)obj;
            UndoRedo.UndoRedoManager.Do(() =>
            {
                MainNavigation.CurrentPage = "ManageSpeciality";
                MainNavigation.CurrentSpecialty = spec.Id;
                ((GroupsPage)MainNavigation.GetPage("DeanGroups")).DataContext = new DeanGroupsViewModel();
                ((DeanPage)MainNavigation.GetPage("Dean")).Frame.Navigate(MainNavigation.GetPage("DeanGroups"));
            });
        });
    }
}