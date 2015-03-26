using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace _6898.utilities {
    public class validate {
        public bool isAdmin(string username) {
            SqlConnection conn = new SqlConnection("Server=localhost;Database=Incident_Report;User Id=SA;Password=inventory38;");
            conn.Open();
            try {
                string query = @"SELECT Username, Role FROM dbo.Users u WHERE u.Username = @Username AND (u.Role = 'Administrator' OR u.Role = 'User')";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Username", username);
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read()) {
                    string role = reader.GetString(1);
                    if (role.Equals("Administrator")) {
                        return true;
                    }
                }
                return false;
            } catch {
                conn.Close();
                return false;
            }
        }

        public bool isUser(string username) {
            SqlConnection conn = new SqlConnection("Server=localhost;Database=Incident_Report;User Id=SA;Password=inventory38;");
            conn.Open();
            try {
                string query = @"SELECT Username, Role FROM dbo.Users u WHERE u.Username = @Username AND (u.Role = 'Administrator' OR u.Role = 'User')";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Username", username);
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read()) {
                    string role = reader.GetString(1);
                    if (role.Equals("User") || role.Equals("Administrator")) {
                        return true;
                    }
                }
                return false;
            } catch {
                conn.Close();
                return false;
            }
        }
    }
}