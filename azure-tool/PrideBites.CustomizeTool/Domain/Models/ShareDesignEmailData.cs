using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PrideBitesCustomizer.Domain.Models
{
    public class ShareDesignEmailData
    {
        public string toEmail { get; set; }
        public string fromEmail { get; set; }
        public string designLink { get; set; }
        public string designImg { get; set; }
        public string designName { get; set; }
        public string designProperties { get; set; }
    }

    public class SaveDesignEmailData
    {
        public string toEmail { get; set; }
        public string designName { get; set; }
        public string designLink { get; set; }
        public string designImg { get; set; }
        public string designProperties { get; set; }
    }
}