using System;
using System.Net;
using System.Net.Mail;
using System.Windows;

namespace DistanceLearningSystem.EmailSender
{
    public static class EmailSender
    {
        public static void SendEmail(MailAddress fromAddress, MailAddress toAddress, string fromPassword,
            string subject, string body)
        {
            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };
            using (var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body
            })
            {
                try
                {
                    smtp.Send(message);
                }
                catch (Exception)
                {
                    MessageBox.Show("Ошибка отправки письма");
                }
            }
            
        }
    }
}