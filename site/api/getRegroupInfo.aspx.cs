using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace _6898.api {
    public partial class getRegroupInfo : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            // Check if requester is a user
            string user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];
            if (!_6898.utilities.Validate.isUser(user)) {
                Response.End();
            }

            int location = Convert.ToInt32(Request.QueryString["location"]);
            int incident = Convert.ToInt32(Request.QueryString["incident"]);

            Dictionary<string, string> result = new Dictionary<string, string>();

            string connectInfo = _6898.utilities.Validate.localDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectInfo);
            try {
                conn.Open();

                string query = @"SELECT Id, Type FROM Incident WHERE Id = @inc";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@inc", incident);
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read()) {
                    result.Add("incidentId", reader.GetInt32(reader.GetOrdinal("Id")).ToString());
                    result.Add("incidentType", reader.GetString(reader.GetOrdinal("Type")));
                }
                reader.Close();

                query = @"SELECT id, incidentId, groupId FROM Groups WHERE incidentId = @inc";
                cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@inc", incident);
                reader = cmd.ExecuteReader();

                if (reader.Read()) {
                    result.Add("groupId", reader.GetInt32(reader.GetOrdinal("groupId")).ToString());
                }
                reader.Close();
                conn.Close();
            } catch (Exception err) {
                conn.Close();
                Response.Write(err);
            }

            string connectInfo2 = _6898.utilities.Validate.localDatabaseConnect();
            SqlConnection conn2 = new SqlConnection(connectInfo2);
            try {
                conn2.Open();

                string query = @"SELECT locationId, locationName FROM Locations WHERE locationId = @loc";
                SqlCommand cmd = new SqlCommand(query, conn2);
                cmd.Parameters.AddWithValue("@loc", location);
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read()) {
                    result.Add("locationId", reader.GetInt32(reader.GetOrdinal("locationId")).ToString());
                    result.Add("locationName", reader.GetString(reader.GetOrdinal("locationName")));
                }
                reader.Close();
                conn2.Close();

                // Send result
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                string resultJson = serializer.Serialize(result);
                Response.Write(resultJson);
            } catch (Exception err) {
                conn2.Close();
                Response.Write(err);
            }
        }
    }
}