using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace _6898.view_only {
    public partial class index : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            string user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];
            nameLiteral.Mode = LiteralMode.Encode;
            nameLiteral.Text = user;
            if (_6898.utilities.Validate.isAdmin(user)) {
                roleLiteral.Text = " - Administrator";
            } else if (_6898.utilities.Validate.isUser(user)) {
                roleLiteral.Text = " - User";
            }
        }
    }
}