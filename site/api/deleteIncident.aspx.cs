using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI.WebControls;

namespace _6898.api {
    public partial class deleteIncident : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            // Check if requester is an admin
            string user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];
            if (!_6898.utilities.Validate.isAdmin(user)) {
                Response.End();
            }

            int id = Convert.ToInt32(Request.QueryString["id"]);

            string connectionString = _6898.utilities.Validate.localDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectionString);
            try {
                conn.Open();
                // Delete incident with matching id
                string query = @"DELETE FROM Incident_History WHERE Id = @Id;";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                int rows = cmd.ExecuteNonQuery();
                conn.Close();
                if (rows == 1) {
                    Response.Write(rows + " row affected from deleteIncident. Success.");
                } else {
                    Response.Write(rows + " rows affected from deleteIncident. Error.");
                }
            } catch (Exception err) {
                conn.Close();
                Response.Write(err);
            }
        }
    }
}