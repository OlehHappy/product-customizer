using Newtonsoft.Json;
using Shopify;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace PrideBitesCustomizer.Domain.Services
{
    public class ProductSchemaProvider
    {
        public static dynamic GetProductSchema(string productName)
        {
            var cacheProvider = new InMemoryCache();
            string cacheKey = string.Format("productSchema-{0}", productName);
            return cacheProvider.Get<dynamic>(cacheKey, PopulateProductSchema, productName);
        }

        private static dynamic PopulateProductSchema(string productName)
        {
            string path = HttpContext.Current.Server.MapPath(string.Format("~/AppContent/ProductData/{0}.json", productName));
            using (StreamReader r = new StreamReader(path))
            {
                string json = r.ReadToEnd();
                return JsonConvert.DeserializeObject<dynamic>(json);
            }
        }
    }

    
}