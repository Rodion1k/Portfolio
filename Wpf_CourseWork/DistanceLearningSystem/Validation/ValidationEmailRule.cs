using System.Globalization;
using System.Text.RegularExpressions;
using System.Windows.Controls;

namespace DistanceLearningSystem.Validation
{
    public class ValidationEmailRule : ValidationRule
    {
        private static readonly Regex EmailRegex = new Regex(@"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}" +
                                                             @"\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+" +
                                                             @"\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$");
        
        public static bool IsValid(string email)
        {
            return !string.IsNullOrWhiteSpace(email) && EmailRegex.IsMatch(email);
        }

        public override ValidationResult Validate(object value, CultureInfo cultureInfo)
        {
            if (value is string email && !EmailRegex.IsMatch(email))
            {
                return new ValidationResult(false, "Неверный формат почты");
            }

            return ValidationResult.ValidResult;
        }
    }
}