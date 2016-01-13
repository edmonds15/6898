using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI.WebControls;

namespace _6898.api {
    public partial class updateIncident : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            // Check if requester is a user
            string user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];
            if (!_6898.utilities.Validate.isUser(user)) {
                Response.End();
            }

            int id = Convert.ToInt32(Request.QueryString["id"]);
            string update = Request.QueryString["update"];

            string connectInfo = _6898.utilities.Validate.localDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectInfo);
            try {
                conn.Open();
                string getQuery = @"SELECT Comment FROM Incident_History WHERE Id = @id";
                SqlCommand getCmd = new SqlCommand(getQuery, conn);
                getCmd.Parameters.AddWithValue("@id", id);
                SqlDataReader reader = getCmd.ExecuteReader();
                string comment = "";
                if (reader.Read()) {
                    comment = reader.GetString(reader.GetOrdinal("Comment"));
                    comment += update;
                    reader.Close();

                    string setQuery = @"UPDATE Incident_History SET Comment = @comment WHERE Id = @id";
                    SqlCommand setCmd = new SqlCommand(setQuery, conn);
                    setCmd.Parameters.AddWithValue("@comment", comment);
                    setCmd.Parameters.AddWithValue("@id", id);
                    int rows = setCmd.ExecuteNonQuery();
                    if (rows == 1) {
                        Response.Write(rows + " row affected. Success.");
                    } else {
                        Response.Write(rows + " rows affected. Failure.");
                    }
                } else {
                    conn.Close();
                    Response.Write("Incident not found");
                }
            } catch (Exception err) {
                conn.Close();
                Response.Write(err);
            }
        }
    }
}