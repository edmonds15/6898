using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace _6898.api {
    public partial class searchIncidents : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
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
                string query = @"SELECT h.Id, h.Number, h.TypeId, h.LocationId, h.Comment, h.TimeDate, h.Creator, e.EntityID, e.[Entity Name], i.Id, i.Type FROM [Incident_Report].[dbo].[Incident_History] h
                                    JOIN [SKYDATA].[Student].[dbo].[Entity] e ON h.LocationId = e.EntityID
                                    JOIN [Incident_Report].[dbo].[Incident] i ON h.TypeId = i.Id
                                    WHERE CAST(h.TypeId AS VARCHAR(20)) LIKE @TypeId
                                    AND CAST(h.LocationId AS VARCHAR(20)) LIKE @LocationId
                                    AND h.Comment LIKE @Comment
                                    AND h.TimeDate > @TimeAfter
                                    AND h.TimeDate < @TimeBefore
                                    ORDER BY h.TimeDate DESC";

                SqlCommand cmd = new SqlCommand(query, conn);
                if (incident == null) {
                    cmd.Parameters.AddWithValue("@TypeId", "%");
                } else {
                    cmd.Parameters.AddWithValue("@TypeId", incident);
                }
                if (location == null) {
                    cmd.Parameters.AddWithValue("@LocationId", "%");
                } else {
                    cmd.Parameters.AddWithValue("@LocationId", location);
                }
                if (comment == null) {
                    cmd.Parameters.AddWithValue("@Comment", "%");
                } else {
                    cmd.Parameters.AddWithValue("@Comment", "%" + comment + "%");
                }  
                if (after == null) {
                    cmd.Parameters.AddWithValue("@TimeAfter", "1/1/1980");
                } else {
                    cmd.Parameters.AddWithValue("@TimeAfter", after);
                }
                if (before == null) {
                    cmd.Parameters.AddWithValue("@TimeBefore", "1/1/2500");
                } else {
                    cmd.Parameters.AddWithValue("@TimeBefore", before);
                }
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read()) {
                    Dictionary<string, string> inc = new Dictionary<string, string>();
                    inc.Add("id", reader.GetInt32(reader.GetOrdinal("Id")).ToString());
                    
                    inc.Add("num", reader.GetInt32(reader.GetOrdinal("Number")).ToString());
                    inc.Add("type_id", reader.GetInt32(reader.GetOrdinal("TypeId")).ToString());
                    inc.Add("type", reader.GetString(reader.GetOrdinal("Type")));
                    inc.Add("location_id", reader.GetInt32(reader.GetOrdinal("LocationId")).ToString());
                    inc.Add("location", reader.GetString(reader.GetOrdinal("Entity Name")));
                    if (!reader.IsDBNull(reader.GetOrdinal("Comment"))) {
                        inc.Add("comment", reader.GetString(reader.GetOrdinal("Comment")));
                    }
                    inc.Add("time", reader.GetDateTime(reader.GetOrdinal("TimeDate")).ToString());
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