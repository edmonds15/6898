using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI.WebControls;

namespace _6898.api {
    public partial class getIncidents : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            // Check if requester is a user
            string user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];
            if (!_6898.utilities.Validate.isUser(user)) {
                Response.End();
            }

            List<Dictionary<String, String>> incidents = new List<Dictionary<String, String>>();
            string connectInfo = _6898.utilities.Validate.localDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectInfo);
            try {
                conn.Open();
                // Get all incidents
                string query = @"SELECT History.Id, History.Number, Incident.Type, Locations.locationName, History.TimeDate, History.Creator FROM Incident_History History
                                    INNER JOIN Incident ON History.TypeId = Incident.Id
                                    INNER JOIN Locations ON History.LocationId = Locations.locationId
                                    ORDER BY History.Number DESC";
                SqlCommand cmd = new SqlCommand(query, conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read()) {
                    Dictionary<String, String> incident = new Dictionary<String, String>();
                    incident.Add("id", reader.GetInt32(reader.GetOrdinal("Id")).ToString());
                    incident.Add("num", reader.GetInt32(reader.GetOrdinal("Number")).ToString());
                    incident.Add("date", reader.GetDateTime(reader.GetOrdinal("TimeDate")).ToString());
                    incident.Add("creator", reader.GetString(reader.GetOrdinal("Creator")));
                    incident.Add("type", reader.GetString(reader.GetOrdinal("Type")).ToString());
                    incident.Add("location", reader.GetString(reader.GetOrdinal("locationName")).ToString());
                    incidents.Add(incident);
                }
                reader.Close();
                conn.Close();

                // Send result
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                string incidentsJson = serializer.Serialize(incidents);
                Response.Write(incidentsJson);
            } catch (Exception err) {
                conn.Close();
                Response.Write(err);
            }
        }
    }
}