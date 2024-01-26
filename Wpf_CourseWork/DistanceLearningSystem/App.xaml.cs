using System;
using System.Windows;
using DistanceLearningSystem.Models;
using DistanceLearningSystem.Views;

namespace DistanceLearningSystem
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App
    {
        private void OnStartup(object sender, StartupEventArgs e)
        {
            AuthorizationWindow authorizationWindow = new AuthorizationWindow(); 
            authorizationWindow.Show(); //TODO ТЕСТ ОКНА АВТОРИЗАЦИИ
          //   Account.Role = "Dean";
          //   //  TODO сделать xml документацию для классов и методов
          //   Account.Faculty = Guid.Parse("B561E43E-4AAA-437C-B730-31C3898CA85D");
          //   Account.Id=Guid.Parse("7F99A7F2-6247-49E0-B999-EB3E44049714");// dean
          //    //Account.Id = Guid.Parse("5B5CC2F0-F5B1-4B69-AF65-BE9622F287E0"); // student
          // // Account.Id = Guid.Parse("35AB0E58-CB10-47F5-92CD-CD16B0D1B9D2"); // teacher
          //
          //   //Account.Id=Guid.Parse("26E1C2EC-0318-43DF-94C9-D176322B5DD9");// student for remove
          //  // Account.Id = Guid.Parse("A4022BD3-43BE-4DC9-BE16-90A90784FB6D"); // Admin
          //   Account.Email = "rodionvaisera@gmail.com";
          //   Account.Name = "Родион Вайсера";
          //   Account.Faculty = Guid.Parse("302FAC5B-90AC-496D-8141-5296E1B961D1");
          //   Account.Specialty = Guid.Parse("E301C163-1D79-4AD1-9986-2323FF7669C0");
          //
          //   MainWindow mainWindow = new MainWindow(Account.Role);
          //   //Account.Id=Guid.Parse("5F3963F5-1D07-435E-BA87-C2B4D89E6123");
          //   //    Account.Role = "Student";
          //   //    Account.Id=Guid.Parse("A26C896E-5267-405B-9D4F-1571181B2AEF");
          //
          //   mainWindow.Show();
        }
    }
}