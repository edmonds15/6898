using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI.WebControls;

namespace _6898.api {
    public partial class editIncident : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            // Check if requester is an admin
            string user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];
            if (!_6898.utilities.Validate.isAdmin(user)) {
                Response.End();
            }

            int id = Convert.ToInt32(Request.QueryString["id"]);
            string num = Request.QueryString["num"];
            string time = Request.QueryString["time"];
            string creator = Request.QueryString["creator"];
            string location = Request.QueryString["loc"];
            string incident = Request.QueryString["inc"];
            string comment = Request.QueryString["comment"];

            string connectInfo = _6898.utilities.Validate.localDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectInfo);
            try {
                conn.Open();

                // Delete the incident with matching id
                string query = @"DELETE FROM Incident_History WHERE Id = @Id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                int rows = cmd.ExecuteNonQuery();
                if (rows == 1) {
                    Response.Write(rows + " row affected from editIncident-delete. Success.\r\n");
                } else {
                    Response.Write(rows + " rows affected from editIncident-delete. Error.");
                    Response.End();
                }

                // Add incident with edited fields
                query = @"INSERT INTO Incident_History VALUES (@Number, @Type, @Location, @Comment, @Time, @User)";
                cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Number", Convert.ToInt32(num));
                cmd.Parameters.AddWithValue("@Type", Convert.ToInt32(incident));
                cmd.Parameters.AddWithValue("@Location", Convert.ToInt32(location));
                if (comment == null) {
                    cmd.Parameters.AddWithValue("@Comment", "");
                } else {
                    cmd.Parameters.AddWithValue("@Comment", comment);
                }
                cmd.Parameters.AddWithValue("@Time", time);
                cmd.Parameters.AddWithValue("@User", creator);
                rows = cmd.ExecuteNonQuery();
                if (rows == 1) {
                    Response.Write(rows + " row affected from editIncident-add. Success.");
                } else {
                    Response.Write(rows + " rows affected from editIncident-add. Error.");
                }

                conn.Close();
            } catch (Exception err) {
                conn.Close();
                Response.Write(err);
            }
        }
    }
}