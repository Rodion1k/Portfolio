using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using DistanceLearningSystem.Views.Pages.Admin;
using DistanceLearningSystem.Views.Pages.Dean;
using DistanceLearningSystem.Views.Pages.Student;
using DistanceLearningSystem.Views.Pages.Teacher;

namespace DistanceLearningSystem.Navigation
{
    public class MainNavigationEventArgs
    {
        public string PageName { get; set; }
    }

    public static class MainNavigation
    {
        public delegate void MainNavigationEventHandler(object sender, MainNavigationEventArgs e);

        public static event MainNavigationEventHandler PageChanged;
        private static readonly Dictionary<string, Page> Pages = new Dictionary<string, Page>();
        public static Guid CurrentSpecialty { get; set; }
        public static Guid CurrentFaculty { get; set; }
        public static short CurrentCurse { get; set; }
        public static Guid CurrentGroup { get; set; }
        public static Guid CurrentSubject { get; set; }
        public static Guid CurrentTest { get; set; }
        private static string _currentPage;
        private static string _currentPageName;

        private static string GetPageNameForEvent(string key)
        {
            var result = "";
            try
            {
                var res = Application.Current.FindResource(key);
                if(res != null)
                {
                    result = res.ToString();
                }
            }
            catch (Exception)
            {
                // ignored
            }
            
            return result;
        }
        public static string CurrentPage
        {
            get => _currentPage;
            set
            {
                _currentPageName = value;
                _currentPage = GetPageNameForEvent(value);
                PageChanged?.Invoke(null, new MainNavigationEventArgs() { PageName = _currentPage });
            }
        }

        static MainNavigation()
        {
            Pages.Add("Admin", new AdminPage());
            Pages.Add("Dean", new DeanPage());
            Pages.Add("Teacher", new TeacherPage());
            Pages.Add("TeacherLectures", new TeacherLecturesPage());
            Pages.Add("TeacherTests", new TeacherTestsPage());
            Pages.Add("TeacherTest",new TeacherTest());
            Pages.Add("TeacherSubjects", new TeacherSubjectsPage());
            Pages.Add("TeacherSubject", new TeacherSubjectPage());
            Pages.Add("Student", new StudentPage());
            Pages.Add("StudentSubjects", new StudentSubjectsPage());
            Pages.Add("StudentSubject", new StudentSubjectPage());
            Pages.Add("StudentLectures", new StudentLecturesPage());
            Pages.Add("StudentTests", new StudentTestsPage());
            Pages.Add("StudentTest", new StudentTestPage());
            Pages.Add("AdminDB", new DataBaseDataGrid());
            Pages.Add("AdminUsers", new DeansDataGrid());
            Pages.Add("AdminFaculties", new FacultiesDataGrid());
            Pages.Add("DeanGroups", new GroupsPage());
            Pages.Add("DeanSpecialities", new SpecialitiesPage());
            Pages.Add("DeanTeachers", new TeachersPage());
            Pages.Add("DeanCurses", new CursesPage());
            Pages.Add("DeanCurse", new DeanCoursePage());
            Pages.Add("DeanStudents", new StudentsPage());
            Pages.Add("DeanSubject", new SubjectPage());
            Pages.Add("DeanSubjects", new DeanSubjects());
            Pages.Add("AdminTeachers", new AdminTeachersPage());
        }

        public static Page GetPage(string pageName)
        {
            if (Pages.ContainsKey(pageName))
            {
                return Pages[pageName];
            }
            else
            {
                return null;
            }
        }

        public static void ChangeTheme()
        {
            var themeDictionary = new ResourceDictionary();
            var iconsDictionary = new ResourceDictionary();
            var oldThemeDictionary =
                Application.Current.Resources.MergedDictionaries.First(x =>
                    x.Source.OriginalString.StartsWith("Resources/Themes"));
            var oldIconsDictionary =
                Application.Current.Resources.MergedDictionaries.First(x =>
                    x.Source.OriginalString.StartsWith("Resources/Icons"));
            if (oldThemeDictionary.Source.OriginalString.Contains("Dark"))
            {
                themeDictionary.Source = new Uri("Resources/Themes/Light.xaml", UriKind.Relative);
                iconsDictionary.Source = new Uri("Resources/Icons/LightTheme.xaml", UriKind.Relative);
            }
            else
            {
                themeDictionary.Source = new Uri("Resources/Themes/Dark.xaml", UriKind.Relative);
                iconsDictionary.Source = new Uri("Resources/Icons/DarkTheme.xaml", UriKind.Relative);
            }

            ReplaceDictionary(themeDictionary, oldThemeDictionary);
            ReplaceDictionary(iconsDictionary, oldIconsDictionary);
        }

        public static void ChangeLanguage()
        {
            var languageDictionary = new ResourceDictionary();
            var oldLanguageDictionary =
                Application.Current.Resources.MergedDictionaries.First(x =>
                    x.Source.OriginalString.StartsWith("Resources/Languages"));
            languageDictionary.Source = oldLanguageDictionary.Source.OriginalString.Contains("English") ? new Uri("Resources/Languages/Russian.xaml", UriKind.Relative) : new Uri("Resources/Languages/English.xaml", UriKind.Relative);
            ReplaceDictionary(languageDictionary, oldLanguageDictionary);
            CurrentPage = _currentPageName;
        }
        private static void ReplaceDictionary(ResourceDictionary newDictionary, ResourceDictionary oldDictionary)
        {
            var index = Application.Current.Resources.MergedDictionaries.IndexOf(oldDictionary);
            Application.Current.Resources.MergedDictionaries.Remove(oldDictionary);
            Application.Current.Resources.MergedDictionaries.Insert(index, newDictionary);
        }
    }
}