using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Shopify;
using System.IO;

namespace PrideBites.Controllers
{
    public class DynamicImageController : Controller
    {
        private dynamic _shopify;

        public ActionResult Index(string drawMode, string text, string textColor, float size, string font, 
                                  int x, int y, int h, int w, string align,
                                  int x2 = 0, int y2 = 0, int h2 = 0, int w2 = 0, string banner = "", string imgSrc = "", int r1 = 0, int r2 = 0, int s1 = 0, int s2 = 0)
        {
            var data = ImageProcessor.TextImage(drawMode, text, textColor, size, font, x, y, h, w, r1, s1, align, x2, y2, h2, w2, r2, s2, banner, imgSrc);
            return base.File(data, "image/png");
        }

        public ActionResult Thumbnail(string size, string d)
        {
            var data = ImageProcessor.Thumbnail(size, d);
            return base.File(data, "image/png");
        }

        //Important for frisbee file uploads
        public ActionResult Upload(string displayMode, int x, int y, int h, int w)
        {
            var data = ImageProcessor.UploadImage(displayMode, x, y, h, w);
            return base.File(data, "image/png");
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);
            ShopifyAuthorizationState authState = Session["shopify_auth_state"] as ShopifyAuthorizationState;
            if (authState != null)
                _shopify = new ShopifyClient(authState);
        }
    }
}
