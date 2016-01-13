using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI.WebControls;

namespace _6898.api {
    public partial class getLocations : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            List<Dictionary<string, string>> locations = new List<Dictionary<string, string>>();
            string connectInfo = _6898.utilities.Validate.localDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectInfo);
            try {
                conn.Open();
                // Get all schools
                //string query = @"SELECT * FROM  Locations ORDER BY locationId";   // Chris commented out  20150929
                string query = @"SELECT * FROM  Locations ORDER BY locationName"; 
                SqlCommand cmd = new SqlCommand(query, conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read()) {
                    Dictionary<string, string> location = new Dictionary<string, string>();
                    location.Add("id", reader.GetInt32(reader.GetOrdinal("locationId")).ToString());
                    location.Add("name", reader.GetString(reader.GetOrdinal("locationName")));
                    locations.Add(location);
                }
                reader.Close();
                conn.Close();

                // Send result
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                string locationsJson = serializer.Serialize(locations);
                Response.Write(locationsJson);
            } catch (Exception err) {
                conn.Close();
                Response.Write(err);
            }
        }
    }
}