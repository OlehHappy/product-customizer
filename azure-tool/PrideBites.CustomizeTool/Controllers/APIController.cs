using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using Shopify;
using System.IO;
using PrideBitesCustomizer.Services;
using PrideBitesCustomizer.Domain.Models;
using Newtonsoft.Json;

namespace PrideBites.Controllers
{
    public class APIController : Controller
    {
        public ActionResult Index()
        {
            if(!Shopify.Environment.IsDevelopment)
                Response.ContentType = "application/liquid";

            return View();
        }

        [HttpGet]
        public JsonResult ShareDesign(string toEmail, string fromEmail, string designImg, string designLink, string designProperties)
        {
            //Send email
            if( !string.IsNullOrEmpty(toEmail) &&
                !string.IsNullOrEmpty(fromEmail) &&
                !string.IsNullOrEmpty(designImg) &&
                !string.IsNullOrEmpty(designLink) &&
                !string.IsNullOrEmpty(designProperties))
            {
                //Template formatting very important.  Mandrill is pickey about picking up template properties.  Also must include disable link tracking attributes
                var linkTemplate = "<a href='{0}' style=\"width: 67%;margin-left: 17%;margin-top: 5%;display: inline-block;border-radius: 0;background: #3e985d;border-bottom: 4px solid #36844e;height: 50px;padding: 0;padding-top: 0;\"><span style=\"color: #fff; font-size: 16px; display: inline-block; margin-top: 17px; margin-left: 31%;\">VIEW THIS DESIGN</span></a>";
                var propertyDictionary = JsonConvert.DeserializeObject<Dictionary<string, string>>(designProperties);
                string combinedProperties = string.Concat(propertyDictionary.SelectMany((k, v) => k.Key + ":" + k.Value + "<br/>"));

                var sender = new MailSender();
                sender.SendShareDesignEmail(new ShareDesignEmailData
                {
                   toEmail = toEmail,
                   fromEmail = fromEmail,
                   designImg = designImg,
                   designLink = string.Format(linkTemplate, designLink),
                   designProperties = combinedProperties
                }, toEmail);
                return Json(true, JsonRequestBehavior.AllowGet);
            }
            return Json(false, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult SaveDesign(string toEmail, string designName, string designImg, string designLink, string designProperties)
        {
            //Send email
            if (!string.IsNullOrEmpty(toEmail) &&
                !string.IsNullOrEmpty(designName) &&
                !string.IsNullOrEmpty(designImg) &&
                !string.IsNullOrEmpty(designLink) && 
                !string.IsNullOrEmpty(designProperties))
            {
                //Template formatting very important.  Mandrill is pickey about picking up template properties.  Also must include disable link tracking attributes
                var linkTemplate = "<a href='{0}' style=\"width: 67%;margin-left: 17%;margin-top: 5%;display: inline-block;border-radius: 0;background: #3e985d;border-bottom: 4px solid #36844e;height: 50px;padding: 0;padding-top: 0;\"><span style=\"color: #fff; font-size: 16px; display: inline-block; margin-top: 17px; margin-left: 31%;\">VIEW THIS DESIGN</span></a>";
                var imageTemplate = "<img src='{0}' style='margin: auto; display:inherit;' />";
                var propertyDictionary = JsonConvert.DeserializeObject<Dictionary<string, string>>(designProperties);
                string combinedProperties = string.Concat(propertyDictionary.SelectMany((k, v) => k.Key + ":" + k.Value + "<br/>"));
                var sender = new MailSender();
                sender.SendSaveDesignEmail(new SaveDesignEmailData
                {
                    toEmail = toEmail,
                    designName = designName,
                    designImg = string.Format(imageTemplate, designImg),
                    designLink = string.Format(linkTemplate, designLink),
                    designProperties = combinedProperties
                }, toEmail);
                return Json(true, JsonRequestBehavior.AllowGet);
            }
            return Json(false, JsonRequestBehavior.AllowGet);
        }

        public ActionResult SubmitWufoo(String firstName, String lastName, String phone, String email, String productName, String productQuantity, String productDescription, String productImage1, String productImage2)
        {
            string wuData = "Field1=" + firstName + "&Field2=" + lastName + "&Field4=" + phone + "&Field9=" + email + "&Field5=" + productName + "&Field6=" + productQuantity + "&Field7=" + productDescription + "&Field11=" + productImage1 + "&Field12=" + productImage2;
            string finalData = Uri.EscapeUriString(wuData);
            string response = string.Empty;
            using (var client = new WebClient())
            {
                client.Headers[HttpRequestHeader.ContentType] = "application/x-www-form-urlencoded";
                client.Credentials = new System.Net.NetworkCredential("UEMO-HUM0-YQI3-6TU9", "pridebites");
                response = client.UploadString("https://pridebites.wufoo.com/api/v3/forms/mebordo15c9mia/entries.json", finalData);
            }
            return Content(response);
        }
      
    }
}
