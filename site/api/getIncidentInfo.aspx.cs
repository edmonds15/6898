using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace _6898.api {
    public partial class getIncidentInfo : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            // Check if requester is a user
            string user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];
            if (!_6898.utilities.Validate.isUser(user)) {
                Response.End();
            }

            int id = Convert.ToInt32(Request.QueryString["id"]);

            Dictionary<string, int> info = new Dictionary<string, int>();

            string connectInfo = _6898.utilities.Validate.localDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectInfo);

            try {
                conn.Open();

                string query = @"SELECT * FROM Incident_History WHERE Id = @id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read()) {
                    info.Add("incID", reader.GetInt32(reader.GetOrdinal("TypeId")));
                    info.Add("locID", reader.GetInt32(reader.GetOrdinal("LocationId")));
                }
                reader.Close();
                conn.Close();

                // Send result
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                string infoJson = serializer.Serialize(info);
                Response.Write(infoJson);
            } catch (Exception err) {
                conn.Close();
                Response.Write(err);
            }
        }
    }
}