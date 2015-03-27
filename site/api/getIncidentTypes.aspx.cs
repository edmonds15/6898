using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace _6898.api {
    public partial class getIncidentTypes : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            List<Dictionary<String, String>> incidents = new List<Dictionary<String, String>>();
            string connectInfo = _6898.utilities.Validate.localDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectInfo);
            conn.Open();
            try {
                string query = @"SELECT * FROM [Incident_Report].[dbo].[Incident] ORDER BY Id";
                SqlCommand cmd = new SqlCommand(query, conn);
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read()) {
                    Dictionary<String, String> incident = new Dictionary<String, String>();
                    incident.Add("id", reader.GetInt32(reader.GetOrdinal("Id")).ToString());
                    incident.Add("type", reader.GetString(reader.GetOrdinal("Type")));
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