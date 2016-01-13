using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace _6898.administrator {
    public partial class index : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            string user = "";
            if (_6898.utilities.Validate.isAdmin(user) && Request.QueryString["user"] != null) {
                user = Request.QueryString["user"];
            } else if (Session["user"] == null) {
                user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];
            } else {
                user = Session["user"].ToString();
            }
            Session["user"] = user;

            // Set literal to not run text as HTML, to avoid scripting vulnerabilities
            nameLiteral.Mode = LiteralMode.Encode;
            nameLiteral.Text = user;
            roleLiteral.Text = "Administrator";
        }
    }
}