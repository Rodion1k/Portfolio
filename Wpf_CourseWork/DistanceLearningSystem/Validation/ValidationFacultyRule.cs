using System.Globalization;
using System.Text.RegularExpressions;
using System.Windows.Controls;

namespace DistanceLearningSystem.Validation
{
    public class ValidationFacultyRule : ValidationRule
    {
        private static readonly Regex EnFacultyNameRegex = new Regex(@"^[A-Z]{1}[a-zA-Z]{1,}$");
        private static readonly Regex RuFacultyNameRegex = new Regex(@"^[А-Я]{1}[а-яА-Я]{1,}$");

        public override ValidationResult Validate(object value, CultureInfo cultureInfo)
        {
            var facultyName = value as string;
            if (facultyName != null &&
                !(EnFacultyNameRegex.IsMatch(facultyName) || RuFacultyNameRegex.IsMatch(facultyName)))
            {
                return new ValidationResult(false, "Неверный формат");
            }
            else if (facultyName != null && facultyName.Length < 3)
            {
                return new ValidationResult(false, "Слишком короткое название");
            }
            else
            {
                return ValidationResult.ValidResult;
            }
        }

        public static bool IsValid(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return false;
            return (EnFacultyNameRegex.IsMatch(email) || RuFacultyNameRegex.IsMatch(email)) && email.Length >= 3;
        }
    }
}