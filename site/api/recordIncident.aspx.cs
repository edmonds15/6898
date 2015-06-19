using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace _6898.api {
    public partial class recordIncident : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            string user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];
            if (!_6898.utilities.Validate.isAdmin(user) && !_6898.utilities.Validate.isUser(user)) {
                Response.End();
            }
            string number = Request.QueryString["number"];
            string location = Request.QueryString["location"];
            string incident = Request.QueryString["incident"];
            string comment = Request.QueryString["comment"];
            string connectInfo = _6898.utilities.Validate.localDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectInfo);
            conn.Open();
            try {
                string query = @"INSERT INTO [Incident_Report].[dbo].[Incident_History] VALUES (@Number, @Type_Id, @Location_Id, @Comment, GETDATE(), @Username)";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Number", Convert.ToInt32(number));
                cmd.Parameters.AddWithValue("@Type_Id", Convert.ToInt32(incident));
                cmd.Parameters.AddWithValue("@Location_Id", Convert.ToInt32(location));
                if (comment == null) {
                    cmd.Parameters.AddWithValue("@Comment", "");
                } else {
                    cmd.Parameters.AddWithValue("@Comment", comment);
                }
                cmd.Parameters.AddWithValue("@Username", user);
                cmd.ExecuteNonQuery();
                conn.Close();
            } catch (Exception error) {
                conn.Close();
                Response.Write(error);
            }
        }
    }
}