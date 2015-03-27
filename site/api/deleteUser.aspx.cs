using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace _6898.api {
    public partial class deleteUser : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            string user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];
            if (!_6898.utilities.Validate.isAdmin(user)) {
                Response.End();
            }

            int id = Convert.ToInt32(Request.QueryString["id"]);

            string connectionString = _6898.utilities.Validate.localDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectionString);
            try {
                conn.Open();
                string query = @"DELETE FROM Users WHERE Id = @Id;";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.ExecuteNonQuery();
            } finally { 
                conn.Close(); 
            }
        }
    }
}