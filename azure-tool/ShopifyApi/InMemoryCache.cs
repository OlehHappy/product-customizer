using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Shopify
{
    public class InMemoryCache : ICacheService
    {
        public T Get<T>(string cacheID, Func<string, T> getItemCallback, string callbackParam) where T : class
        {
            T item = HttpRuntime.Cache.Get(cacheID) as T;
            if (item == null)
            {
                item = getItemCallback(callbackParam);
                HttpContext.Current.Cache.Insert(cacheID, item);
            }
            return item;
        }
    }

    interface ICacheService
    {
        T Get<T>(string cacheID, Func<string, T> getItemCallback, string callbackParam) where T : class;
    }
}
