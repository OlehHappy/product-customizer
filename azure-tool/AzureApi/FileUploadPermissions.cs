using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AzureApi
{
    public class FileUploadPermissions
    {
        private static StorageCredentials credentials = new StorageCredentials("pridebites", "klWDdGWmR6bIYpGGYD74IayiElEiC+agXabiOpbvYFWyr++zZDoQR6dVUd71UyWUpc+8PtV6/RCdNEFSBMHO8A==");

       
       
        public static String GetSasForBlob( String blobUri, String verb)
        {
            CloudBlockBlob blob = new CloudBlockBlob(new Uri(blobUri), credentials);
            var permission = SharedAccessBlobPermissions.Write;

            if (verb == "DELETE")
            {
                permission = SharedAccessBlobPermissions.Delete;
            }

            var sas = blob.GetSharedAccessSignature(new SharedAccessBlobPolicy()
            {

                Permissions = permission,
                SharedAccessExpiryTime = DateTime.UtcNow.AddMinutes(15),
            });

            return string.Format(CultureInfo.InvariantCulture, "{0}{1}", blob.Uri, sas);
        }
   
    }
}
