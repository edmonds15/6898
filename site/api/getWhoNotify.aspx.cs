using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace _6898.api {
    public partial class getWhoNotify : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            string user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];
            if (!_6898.utilities.Validate.isUser(user)) {
                Response.End();
            }

            string location = Request.QueryString["location"];
            string incident = Request.QueryString["incident"];

            List<Dictionary<string, string>> notifys = new List<Dictionary<string, string>>();
            string connectInfo = _6898.utilities.Validate.localDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectInfo);
            try {
                conn.Open();
                string query = @"SELECT n.Id, n.Code, n.Name As Department, c.Name, c.Title, c.Ext, c.Home_Number, c.Cell_Number FROM Notification n
                                    LEFT JOIN Contact c ON n.Code = c.Code
                                    WHERE CAST(n.Incident_Id AS VARCHAR(20)) LIKE @Incident_Id";

                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Incident_Id", incident);
               
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read()) {
                    Dictionary<string, string> notify = new Dictionary<string, string>();
                    notify.Add("id", reader.GetInt32(reader.GetOrdinal("Id")).ToString());
                    notify.Add("code", reader.GetString(reader.GetOrdinal("Code")));
                    notify.Add("department", reader.GetString(reader.GetOrdinal("Department")));
                    if (!reader.IsDBNull(reader.GetOrdinal("Name"))) {
                        notify.Add("name", reader.GetString(reader.GetOrdinal("Name")));
                        notify.Add("title", reader.GetString(reader.GetOrdinal("Title")));
                        notify.Add("ext", reader.GetString(reader.GetOrdinal("Ext")));
                        notify.Add("home_num", reader.GetString(reader.GetOrdinal("Home_Number")));
                        notify.Add("cell_num", reader.GetString(reader.GetOrdinal("Cell_Number")));
                    } else {
                        notify.Add("name", "");
                        notify.Add("title", "");
                        notify.Add("ext", "");
                        notify.Add("home_num", "");
                        notify.Add("cell_num", "");
                    }
                    notifys.Add(notify);
                }
                conn.Close();

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                string incidentsJson = serializer.Serialize(notifys);
                Response.Write(incidentsJson);
            } catch (Exception err) {
                conn.Close();
                Response.Write(err);
            }
        }
    }
}