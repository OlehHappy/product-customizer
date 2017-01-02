using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Shopify
{
    public class ContentLocation
    {
        public static string GetPath(IHtmlString content)
        {
            return GetPath(content.ToHtmlString());
        }
        public static string OptionContent_GetPath(string content)
        {
            return GetPath("/AppContent/OptionImages/" + content);
        }
        public static string CatalogContent_GetPath(string content)
        {
            return GetPath("/AppContent/Catalog/" + content);
        }
        public static string ProductImageContent_GetPath(string content)
        {
            return GetPath("/AppContent/ProductImages/" + content);
        }
        public static string LightboxImageContent_GetPath(string content)
        {
            return GetPath("/AppContent/LightboxImages/" + content);
        }

        public static string GetPath(string content)
        {
            if (!Environment.IsDevelopment)
                content = "http://pridebites.azurewebsites.net" + content;
            return content;
        }

        public static string 
            GetPublicPath(string content)
        {
            if (!Environment.IsDevelopment)
                content = "http://pridebites.com/apps/custom-pridebites" + content;
            return content;
        }
    }
}
