using System.Globalization;
using System.Windows.Controls;

namespace DistanceLearningSystem.Validation
{
    public class ValidationPasswordRule: ValidationRule
    {
        public static bool IsValid(string password)
        {
            if(string.IsNullOrWhiteSpace(password)) return false;
            return password.Length >= 6 ;
        }
        public override ValidationResult Validate(object value, CultureInfo cultureInfo)
        {
            if (value is string password && password.Length < 6)
            {
                return new ValidationResult(false, "Длина пароля должна быть больше 6 символов");
            }
            return ValidationResult.ValidResult;
        }
    }
}