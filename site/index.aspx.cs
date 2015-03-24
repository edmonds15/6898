using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace _6898 {
    public partial class index : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            Response.Write("Hello World");
            string user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];
            Response.Write(user);
            SqlConnection conn = new SqlConnection("Server=localhost;Database=Incident_Report;User Id=SA;Password=inventory38;");
            conn.Open();
            try {
                string query = @"SELECT Username, Role FROM dbo.Users u WHERE u.Username = @Username AND (u.Role = 'Administrator' OR u.Role = 'User')";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Username", user);
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read()) {
                    string role = reader.GetString(1);
                    if (role.Equals("Administrator")) {
                        Response.Redirect("http://www.google.com");
                    } else if (role.Equals("User")) {
                        Response.Redirect("http://www.bing.com");
                    } else {
                        Response.Redirect("about:blank");
                    }
                }
            } catch {
                conn.Close();
            }
        }
    }
}