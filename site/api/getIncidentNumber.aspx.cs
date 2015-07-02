using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI.WebControls;

namespace _6898.api {
    public partial class getIncidentNumber : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            Dictionary<String, int> entry = new Dictionary<String, int>();
            string connectInfo = _6898.utilities.Validate.localDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectInfo);
            try {
                conn.Open();
                // Get highest number incident
                string query = @"SELECT TOP 1 Number FROM [Incident_Report].[dbo].[Incident_History] ORDER BY Number DESC";
                SqlCommand cmd = new SqlCommand(query, conn);
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read()) {
                    entry.Add("count", reader.GetInt32(reader.GetOrdinal("Number")) + 1);
                }
                conn.Close();

                // Send result
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                string countsJson = serializer.Serialize(entry);
                Response.Write(countsJson);
            } catch (Exception err) {
                conn.Close();
                Response.Write(err);
            }
        }
    }
}