using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace _6898.api {
    public partial class getContacts : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            string user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];
            if (!_6898.utilities.Validate.isAdmin(user)) {
                Response.End();
            }

            List<Dictionary<string, string>> contacts = new List<Dictionary<string, string>>();
            string connectInfo = _6898.utilities.Validate.localDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectInfo);
            try {
                conn.Open();
                string query = @"SELECT * FROM [Incident_Report].[dbo].[Contact] ORDER BY Name ASC";
                SqlCommand cmd = new SqlCommand(query, conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read()) {
                    Dictionary<string, string> contact = new Dictionary<string, string>();
                    contact.Add("id", reader.GetInt32(reader.GetOrdinal("Id")).ToString());
                    contact.Add("name", reader.GetString(reader.GetOrdinal("Name")));
                    contact.Add("title", reader.GetString(reader.GetOrdinal("Title")));
                    contact.Add("ext", reader.GetString(reader.GetOrdinal("Ext")));
                    contact.Add("home", reader.GetString(reader.GetOrdinal("Home_Number")));
                    contact.Add("cell", reader.GetString(reader.GetOrdinal("Cell_Number")));
                    contacts.Add(contact);
                }

                conn.Close();

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                string incidentsJson = serializer.Serialize(contacts);
                Response.Write(incidentsJson);
            } catch (Exception err) {
                conn.Close();
                Response.Write(err);
            }
        }
    }
}