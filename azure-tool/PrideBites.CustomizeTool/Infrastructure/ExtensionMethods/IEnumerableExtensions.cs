using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PrideBitesCustomizer.Infrastructure.ExtensionMethods
{
    public static class IEnumerableExtensions
    {
            // usage: someObject.SingleItemAsEnumerable();
            public static IEnumerable<T> SingleItemAsEnumerable<T>(this T item)
            {
                yield return item;
            }
    }
}