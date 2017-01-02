using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Shopify
{
    public class Environment
    {
        public static bool IsDevelopment
        {
            get {
                #if DEBUG
                    return true;
                #else
                    return false;
                #endif
                //string[] devUrls = {"localhost", "dev.pridebites.com"};
                //string request = HttpContext.Current.Request.Url.AbsoluteUri;

                //foreach (string url in devUrls) {
                //    if (request.Contains(url))
                //        return true;
                //}
                //return false;
            }
        }

        //Where is this app installed in shopify.  Important for pathing.
        public static string AppName
        {
            get{
                if (IsDevelopment)
                    return String.Empty;
                else
                    return "custom-pridebites/";
            }
        }
    }
}
