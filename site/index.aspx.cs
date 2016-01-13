using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace _6898 {
    public partial class index : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            string user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];
            if (_6898.utilities.Validate.isAdmin(user) && Request.QueryString["user"] != null) {
                user = Request.QueryString["user"];
            }
            Session["user"] = user;

            if (_6898.utilities.Validate.isAdmin(user)) {
                Response.Redirect("administrator/");
            } else if (_6898.utilities.Validate.isUser(user)) {
                Response.Redirect("user/");
            } else {
                Response.Redirect("view-only/");
            }
        }
    }
}