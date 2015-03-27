using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using _6898.utilities;

namespace _6898.administrator {
    public partial class index : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            string user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];
            if (!_6898.utilities.Validate.isAdmin(user)) {
                Response.Redirect("..");
            }
            nameLiteral.Text = user;
            roleLiteral.Text = "Administrator";
        }
    }
}