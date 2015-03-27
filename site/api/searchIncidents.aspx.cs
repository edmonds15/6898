using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;
using _6898.utilities;

namespace _6898.api {
    public partial class searchIncidents : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            string user = HttpContext.Current.User.Identity.Name.Split("\\".ToCharArray())[1];

            string location = Request.QueryString["location"];
            string incident = Request.QueryString["incident"];
            string comment = Request.QueryString["comment"];
            string after = Request.QueryString["after"];
            string before = Request.QueryString["before"];
            List<Dictionary<string, string>> incidents = new List<Dictionary<string, string>>();
            string connectInfo = _6898.utilities.Validate.localDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectInfo);
            conn.Open();
            try {
                string query = @"SELECT h.Id, h.Type_Id, h.Location_Id, h.Comment, h.Time, h.Creator, e.EntityId, e.[Entity Name], i.Id, i.Type FROM Incident_History h
                                    JOIN [SKYDATA].[Student].[dbo].[Entity] e ON h.Location_Id = e.EntityID
                                    JOIN Incident i ON h.Type_Id = i.Id
                                    WHERE CAST(h.Type_Id AS VARCHAR(20)) LIKE @Type_Id
                                    AND CAST(h.Location_Id AS VARCHAR(20)) LIKE @Location_Id
                                    AND h.Comment LIKE @Comment
                                    AND h.Time > @Time_After
                                    AND h.Time < @Time_Before
                                    ORDER BY h.Id DESC";

                SqlCommand cmd = new SqlCommand(query, conn);
                if (incident == null) {
                    cmd.Parameters.AddWithValue("@Type_Id", "%");
                } else {
                    cmd.Parameters.AddWithValue("@Type_Id", incident);
                }
                if (location == null) {
                    cmd.Parameters.AddWithValue("@Location_Id", "%");
                } else {
                    cmd.Parameters.AddWithValue("@Location_Id", location);
                }
                if (comment == null) {
                    cmd.Parameters.AddWithValue("@Comment", "%");
                } else {
                    cmd.Parameters.AddWithValue("@Comment", "%" + comment + "%");
                }  
                if (after == null) {
                    cmd.Parameters.AddWithValue("@Time_After", "1/1/1980");
                } else {
                    cmd.Parameters.AddWithValue("@Time_After", after);
                }
                if (before == null) {
                    cmd.Parameters.AddWithValue("@Time_Before", "1/1/2500");
                } else {
                    cmd.Parameters.AddWithValue("@Time_Before", before);
                }
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read()) {
                    Dictionary<string, string> inc = new Dictionary<string, string>();
                    inc.Add("id", reader.GetInt32(reader.GetOrdinal("Id")).ToString());
                    inc.Add("type_id", reader.GetInt32(reader.GetOrdinal("Type_Id")).ToString());
                    inc.Add("type", reader.GetString(reader.GetOrdinal("Type")));
                    inc.Add("location_id", reader.GetInt32(reader.GetOrdinal("Location_Id")).ToString());
                    inc.Add("location", reader.GetString(reader.GetOrdinal("Entity Name")));
                    if (!reader.IsDBNull(reader.GetOrdinal("Comment"))) {
                        inc.Add("comment", reader.GetString(reader.GetOrdinal("Comment")));
                    }
                    inc.Add("time", reader.GetDateTime(reader.GetOrdinal("Time")).ToString());
                    if (!reader.IsDBNull(reader.GetOrdinal("Creator"))) {
                        inc.Add("creator", reader.GetString(reader.GetOrdinal("Creator")));
                    }
                    incidents.Add(inc);
                }
                conn.Close();
            } catch (Exception error) {
                conn.Close();
            }

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            string incidentsJson = serializer.Serialize(incidents);
            Response.Write(incidentsJson);
        }
    }
}