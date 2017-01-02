using PrideBitesCustomizer.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PrideBitesCustomizer.Infrastructure.ExtensionMethods;

namespace PrideBitesCustomizer.Services
{
    public class MailSender
    {
        private static readonly string AccountKey = "0WU8_AxV9BBZ5RSwnOuHEw";
        private void SendTemplate(object emailData, string template, string sendToAddress)
        {
            var api = new Mandrill.MandrillApi(AccountKey, true);
            var toEmail = new Mandrill.EmailAddress(sendToAddress);

            var message = new Mandrill.EmailMessage()
            {
                to = new Mandrill.EmailAddress[] { toEmail },
                track_opens = true,
                track_clicks = true,
                merge = true,
            };

            //Add all order confirmation email data properties to email template
            var data = emailData.ToDictionary<string>();
            foreach (var d in data)
            {
                message.AddGlobalVariable(d.Key, d.Value);
            }


            api.SendMessageAsync(message, template, Enumerable.Empty<Mandrill.TemplateContent>());

        }

        public void SendShareDesignEmail(ShareDesignEmailData emailData, string sendToEmail)
        {
            //Template markup defined in Mandrill dashboard
            SendTemplate(emailData, "ShareDesign", sendToEmail);
        }

        public void SendSaveDesignEmail(SaveDesignEmailData emailData, string sendToEmail)
        {
            //Template markup defined in Mandrill dashboard
            SendTemplate(emailData, "SaveDesign", sendToEmail);
        }
    }
}