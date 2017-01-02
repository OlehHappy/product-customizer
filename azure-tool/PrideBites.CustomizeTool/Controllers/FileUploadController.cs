using AzureApi;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PrideBites.Controllers
{
    public class FileUploadController : Controller
    {
            
        //[HttpPost]
        //public string SaveFile(HttpPostedFileBase file)
        //{
        //    if (file != null && file.ContentLength > 0)
        //    {
        //        // random guid for now, is there some kind of shopify session variable we can use as an indentifier instead?
        //        var id = Guid.NewGuid();

        //        var fileName = id + file.FileName;
        //        var path = Path.Combine(Server.MapPath("~/App_Data/CustomerImages"), fileName); 
        //        file.SaveAs(path);
        //    }

        //    return null;
        //}

        //public ActionResult signature(string blobUri, string _method)
        //{
        //    var sas = FileUploadPermissions.GetSasForBlob(blobUri, _method);
        //    return Content(sas);
        //}

        //[HttpPost]
        //public JsonResult success(string blob, string uuid, string name, string container) 
        //{ 
        //    //return 200
        //    var response = new { blob = blob, uuid = uuid, name = name, container = container };
        //    return Json(response);
        //}
    }
}
