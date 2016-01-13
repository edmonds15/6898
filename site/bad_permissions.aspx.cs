using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace _6898 {
    public partial class bad_permissions : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            string user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];
            if (Session["user"] != null) {
                user = Session["user"].ToString();
            }
            Session["user"] = user;

            // Set literal to not run text as HTML, to avoid scripting vulnerabilities
            nameLiteral.Mode = LiteralMode.Encode;
            nameLiteral.Text = user;
        }
    }
}