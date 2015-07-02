using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace _6898.administrator {
    public partial class index : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            string user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];
            if (!_6898.utilities.Validate.isAdmin(user)) {
                Response.Redirect("../bad_permissions.aspx");
            }

            // Set literals to not run text as HTML, to avoid scripting vulnerabilities
            nameLiteral.Mode = LiteralMode.Encode;
            nameLiteral.Text = user;
            roleLiteral.Text = "Administrator";
        }
    }
}