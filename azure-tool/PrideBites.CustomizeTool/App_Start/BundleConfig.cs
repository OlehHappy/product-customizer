using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace PrideBites.App_Start
{
    public static class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/minFramework", Shopify.ContentLocation.GetPath("/bundles/minFramework"))
                    .Include("~/Scripts/lodash.compat.min.js")
                    .Include("~/Scripts/jsonselect.js")
                    .Include("~/Scripts/knockout-*")
                    .Include("~/Scripts/almond.js")
                    );

            bundles.Add(new ScriptBundle("~/bundles/framework", Shopify.ContentLocation.GetPath("/bundles/framework"))
                    .Include("~/Scripts/jquery-2.*")
                    .Include("~/Scripts/jquery.cookie.js")
                    .Include("~/Scripts/lodash.compat.min.js")
                    .Include("~/Scripts/modernizr-*")
                    .Include("~/Scripts/checkForIE.js")
                    .Include("~/Scripts/bootstrap.min.js")
                    .Include("~/Scripts/knockout-*")
                    .Include("~/Scripts/jsonselect.js")
                    .Include("~/Scripts/imagesloaded.pkgd.min.js") //http://desandro.github.io/imagesloaded/ //Must come before Almond
                    .Include("~/Scripts/almond.js")
                    //.Include("~/Scripts/custom.fineuploader-5.0.3/custom.fineuploader-5.0.3.min.js")
                    );
            string contentVersion = System.Configuration.ConfigurationManager.AppSettings["styleUpdateDate"];

#if DEBUG
            //bundle without min
            var jsBundle = new Bundle("~/bundles/app")
                                .IncludeDirectory("~/Scripts/App", "*.js", true);
#else
            //Bundle without min
            //var jsBundle = new Bundle("~/bundles/app", Shopify.ContentLocation.GetPath("/bundles/app?v=" + contentVersion))
            //                    .IncludeDirectory("~/Scripts/App", "*.js", true);

            //bundle with min
            var jsBundle = new ScriptBundle("~/bundles/app", Shopify.ContentLocation.GetPath("/bundles/app?v=" + contentVersion))
                                .IncludeDirectory("~/Scripts/App", "*.js", true);
#endif
            bundles.Add(jsBundle);

            bundles.Add(new StyleBundle("~/Content/css", Shopify.ContentLocation.GetPath("/Content/css?v=" + contentVersion))
                .Include("~/Content/bootstrap.css")
                .Include("~/Content/bootstrap-override.css")
                .Include("~/Content/site.css"));
                //.Include("~/Scripts/custom.fineuploader-5.0.3/custom.fineuploader-5.0.3.min.css"));

            bundles.UseCdn = !Shopify.Environment.IsDevelopment;
            BundleTable.EnableOptimizations = true;
        }
    }
}