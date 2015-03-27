using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Web.Script.Serialization;

namespace _6898.api {
    public partial class getIncidents : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            List<Dictionary<string, string>> incidents = new List<Dictionary<string, string>>();
            string connectInfo = _6898.utilities.Validate.localDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectInfo);
            conn.Open();
            try {
                string query = "SELECT * FROM [Incident_Report].[dbo].[Incident_History] ORDER BY Id";
                SqlCommand cmd = new SqlCommand(query, conn);
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read()) {
                    Dictionary<string, string> incident = new Dictionary<String, String>();
                    incident.Add("id", reader.GetInt32(reader.GetOrdinal("Id")).ToString());
                    incident.Add("typeId", reader.GetInt32(reader.GetOrdinal("Type_Id")).ToString());
                    incident.Add("locationId", reader.GetInt32(reader.GetOrdinal("Location_Id")).ToString());
                    incident.Add("comment", reader.GetString(reader.GetOrdinal("Comment")));
                    incident.Add("time", reader.GetDateTime(reader.GetOrdinal("Time")).ToString());
                    incident.Add("creator", reader.GetString(reader.GetOrdinal("Creator")));
                    incidents.Add(incident);
                }
                conn.Close();
            } catch {
                conn.Close();
            }
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            string incidentsJson = serializer.Serialize(incidents);
            Response.Write(incidentsJson);
        }
    }
}