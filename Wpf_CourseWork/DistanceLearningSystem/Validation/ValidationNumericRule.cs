using System.Globalization;
using System.Text.RegularExpressions;
using System.Windows.Controls;

namespace DistanceLearningSystem.Validation
{
    public class ValidationNumericRule : ValidationRule
    {
        private static readonly Regex Regex = new Regex(@"^[0-9]+$");
        public override ValidationResult Validate(object value, CultureInfo cultureInfo)
        {
            
            return value != null && Regex.IsMatch(value.ToString())
                ? ValidationResult.ValidResult
                : new ValidationResult(false, "");
        }
        public static bool IsValid(string number)
        {
            return !string.IsNullOrWhiteSpace(number) && Regex.IsMatch(number);
        }
    }
}