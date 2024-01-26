using System.Globalization;
using System.Text.RegularExpressions;
using System.Windows.Controls;

namespace DistanceLearningSystem.Validation
{
    public class ValidationInitialsRule : ValidationRule
    {
        private static readonly Regex EnInitialsRegex = new Regex(@"^[A-Z]{1}[a-z]{1,}$");
        private static readonly Regex RusInitialsRegex = new Regex(@"^[А-Я]{1}[а-я]{1,}$");
        public static bool IsValid(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return false;
            return EnInitialsRegex.IsMatch(email) || RusInitialsRegex.IsMatch(email);
        }

        public override ValidationResult Validate(object value, CultureInfo cultureInfo)
        {
            if (value is string initial && (EnInitialsRegex.IsMatch(initial) || RusInitialsRegex.IsMatch(initial)))
            {
                return ValidationResult.ValidResult;
            }
            return new ValidationResult(false, "Неверный формат");
        }
    }
}