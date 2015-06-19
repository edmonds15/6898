using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace _6898.api {
    public partial class editIncident : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            string user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];
            if (!_6898.utilities.Validate.isAdmin(user)) {
                Response.End();
            }
            string id = Request.QueryString["id"];
            string num = Request.QueryString["num"];
            string time = Request.QueryString["time"];
            string creator = Request.QueryString["creator"];
            string location = Request.QueryString["loc"];
            string incident = Request.QueryString["inc"];
            string comment = Request.QueryString["comment"];
            string connectInfo = _6898.utilities.Validate.localDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectInfo);
            conn.Open();
            try {
                string query = @"DELETE FROM Incident_History WHERE Id = @Id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", Convert.ToInt32(id));
                cmd.ExecuteNonQuery();
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
                cmd.ExecuteNonQuery();
                conn.Close();
            } catch (Exception err) {
                conn.Close();
                Response.Write(err);
            }
        }
    }
}