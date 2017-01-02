using AzureApi;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PrideBites.Controllers
{
    public class signatureController : Controller
    {

        public ActionResult index(string blobUri, string _method)
        {
            var sas = FileUploadPermissions.GetSasForBlob(blobUri, _method);
            return Content(sas);
        }

    }
}
