using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using _6898.utilities;
using System.Data.SqlClient;
using System.Web.Script.Serialization;

namespace _6898.api {
    public partial class getUsers : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            List<Dictionary<string, string>> users = new List<Dictionary<string, string>>();
            string connectInfo = _6898.utilities.Validate.localDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectInfo);
            conn.Open();
            try {
                string query = "SELECT * FROM [Incident_Report].[dbo].[Users] ORDER BY Role ASC, Username ASC";
                SqlCommand cmd = new SqlCommand(query, conn);
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read()) {
                    Dictionary<string, string> user = new Dictionary<string, string>();
                    user.Add("id", reader.GetInt32(reader.GetOrdinal("Id")).ToString());
                    user.Add("username", reader.GetString(reader.GetOrdinal("Username")));
                    user.Add("role", reader.GetString(reader.GetOrdinal("Role")));
                    users.Add(user);
                }
                conn.Close();
            } catch {
                conn.Close();
            }

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            string usersJson = serializer.Serialize(users);
            Response.Write(usersJson);
        }
    }
}