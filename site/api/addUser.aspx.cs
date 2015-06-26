using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace _6898.api {
    public partial class addUser : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            string user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];
            if (!_6898.utilities.Validate.isAdmin(user)) {
                Response.End();
            }

            string username = Request.QueryString["username"];
            string role = Request.QueryString["role"];

            string connectionString = _6898.utilities.Validate.localDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectionString);
            try {
                conn.Open();
                string query = @"INSERT INTO Users
                                SELECT @Username, @Role
                                WHERE NOT EXISTS (SELECT Id FROM Users WHERE Username = @Username)";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Username", username);
                cmd.Parameters.AddWithValue("@Role", role);
                int rows = cmd.ExecuteNonQuery();
                conn.Close();
                if (rows == 1) {
                    Response.Write(rows + " row affected from addUser. Success.");
                } else {
                    Response.Write(rows + " rows affected from addUser. Error.");
                }
            } catch (Exception err) {
                conn.Close();
                Response.Write(err);
            }
        }
    }
}