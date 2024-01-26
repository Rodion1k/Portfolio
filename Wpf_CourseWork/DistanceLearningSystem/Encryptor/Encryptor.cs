using System.Security.Cryptography;
using System.Text;

namespace DistanceLearningSystem.Encryptor
{
    public static class Encryptor
    {
        public static string Encrypt(string text)
        {
            SHA256Managed sha = new SHA256Managed();
           var hash= sha.ComputeHash(Encoding.UTF8.GetBytes(text));
            string result = string.Empty;
            foreach (var item in hash)
            {
                result += item.ToString("x2");
            }
            return result;
        }
    }
}