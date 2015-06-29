using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;

namespace _6898.utilities {
    public static class Validate {
        public static bool isAdmin(string username) {
            string connectInfo = localDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectInfo);
            try {
                conn.Open();
                string query = @"SELECT Username, Role FROM dbo.Users u WHERE u.Username = @Username AND (u.Role = 'Administrator' OR u.Role = 'User')";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Username", username);
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read()) {
                    string role = reader.GetString(1);
                    if (role.Equals("Administrator")) {
                        conn.Close();
                        return true;
                    }
                }
                conn.Close();
                return false;
            } catch {
                conn.Close();
                return false;
            }
        }

        public static bool isUser(string username) {
            string connectInfo = localDatabaseConnect();
            SqlConnection conn = new SqlConnection(connectInfo);
            try {
                conn.Open();
                string query = @"SELECT Username, Role FROM dbo.Users u WHERE u.Username = @Username AND (u.Role = 'Administrator' OR u.Role = 'User')";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Username", username);
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read()) {
                    string role = reader.GetString(1);
                    if (role.Equals("User") || role.Equals("Administrator")) {
                        conn.Close();
                        return true;
                    }
                }
                conn.Close();
                return false;
            } catch {
                conn.Close();
                return false;
            }
        }

        public static string localDatabaseConnect() {
            StreamReader stream = new StreamReader("C:\\passwords\\passwords.csv");
            string data = stream.ReadLine();
            stream.Close();
            char[] split = {','};
            string[] connectInfo = data.Split(split);
            return "Server=" + connectInfo[0] + ";Database=" + connectInfo[1] + ";User Id=" + connectInfo[2] + ";Password=" + connectInfo[3];
        }

        public static string skywardDatabaseConnect() {
            StreamReader stream = new StreamReader("C:\\passwords\\passwords.csv");
            stream.ReadLine();
            string data = stream.ReadLine();
            stream.Close();
            char[] split = new char[1];
            split[0] = ',';
            string[] connectInfo = data.Split(split);
            return "Server=" + connectInfo[0] + ";Database=" + connectInfo[1] + ";User Id=" + connectInfo[2] + ";Password=" + connectInfo[3] + ";";
        }
    }
}