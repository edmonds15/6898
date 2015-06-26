using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace _6898.api {
    public partial class getLocations : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            List<Dictionary<string, string>> locations = new List<Dictionary<string, string>>();
            string connectInfo = _6898.utilities.Validate.skywardDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectInfo);
            try {
                conn.Open();
                string query = @"SELECT * FROM  [Student].[dbo].[Entity] ORDER BY [Entity Name] ASC";
                SqlCommand cmd = new SqlCommand(query, conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read()) {
                    Dictionary<string, string> location = new Dictionary<string, string>();
                    location.Add("id", reader.GetInt16(reader.GetOrdinal("EntityID")).ToString());
                    location.Add("name", reader.GetString(reader.GetOrdinal("Entity Name")));
                    location.Add("street_address", reader.GetString(reader.GetOrdinal("Street Address")));
                    location.Add("city", reader.GetString(reader.GetOrdinal("City")));
                    location.Add("state", reader.GetString(reader.GetOrdinal("State")));
                    location.Add("zip", reader.GetString(reader.GetOrdinal("Zip")));
                    location.Add("phone", reader.GetString(reader.GetOrdinal("Phone")));
                    if (!reader.IsDBNull(reader.GetOrdinal("Abbrev"))) {
                        location.Add("abbrev", reader.GetString(reader.GetOrdinal("Abbrev")));
                    }
                    if (!reader.IsDBNull(reader.GetOrdinal("ShortName"))) {
                        location.Add("short_name", reader.GetString(reader.GetOrdinal("ShortName")));
                    }
                    locations.Add(location);
                }
                conn.Close();

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