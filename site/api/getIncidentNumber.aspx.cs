using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace _6898.api {
    public partial class getIncidentNumber : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            Dictionary<String, int> entries = new Dictionary<String, int>();
            SqlConnection conn = new SqlConnection("Server=localhost;Database=Incident_Report;User Id=SA;Password=inventory38;");
            conn.Open();
            try {
                string query = @"SELECT count(*)+1 AS [Counts] FROM [Incident_Report].[dbo].[Incident_History]";
                SqlCommand cmd = new SqlCommand(query, conn);
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read()) {
                    entries.Add("count", reader.GetInt32(reader.GetOrdinal("Counts")));
                }
            } catch {
                conn.Close();
            }

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            string locationsJson = serializer.Serialize(entries);
            Response.Write(locationsJson);
        }
    }
}