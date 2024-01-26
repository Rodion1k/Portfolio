using System.ComponentModel;

namespace DistanceLearningSystem.ViewModels.MainVM
{
    public abstract class ViewModelBase : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;

        protected void OnPropertyChanged(string propertyName = null)
        {
            PropertyChangedEventHandler handler = PropertyChanged;
            if (handler != null) handler(this, new PropertyChangedEventArgs(propertyName));
        }
        
        
       // TODO метод закрытия окна
       protected void Close(object sender)
       {
           
           foreach (System.Windows.Window window in System.Windows.Application.Current.Windows)
           {
               if (window.DataContext == sender)
               {
                   window.Close();
                   return;
               }
           }
       }
    }
}