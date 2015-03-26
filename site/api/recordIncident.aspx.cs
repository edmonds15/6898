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
            string location = Request.QueryString["location"];
            string incident = Request.QueryString["incident"];
            string comment = Request.QueryString["comment"];
            string user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];
            SqlConnection conn = new SqlConnection("Server=localhost;Database=Incident_Report;User Id=SA;Password=inventory38;");
            conn.Open();
            try {
                string query = @"INSERT INTO [Incident_Report].[dbo].[Incident_History] VALUES (@Type_Id, @Location_Id, @Comment, GETDATE(), @Username)";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Type_Id", Convert.ToInt32(incident));
                cmd.Parameters.AddWithValue("@Location_Id", Convert.ToInt32(location));
                cmd.Parameters.AddWithValue("@Comment", comment);
                cmd.Parameters.AddWithValue("@Username", user);
                cmd.ExecuteNonQuery();
            } catch (Exception error) {
                conn.Close();
            }
        }
    }
}