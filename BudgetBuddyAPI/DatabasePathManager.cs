using System;
using Microsoft.Data.Sqlite;

namespace BudgetBuddyAPI
{
    public static class DatabasePathManager
    {
        public static string DbFilePath { get; private set; }

        public static void SetDatabasePath(string dbPath)
        {
            DbFilePath = dbPath;
        }

        public static string GetDatabasePath()
        {
            return DbFilePath;
        }
        public static void ExecuteSql(string sqlQuery)
        {
            // Access the database path using the DatabasePathManager
            string dbFilePath = DbFilePath;

            // Check if dbFilePath is null and throw an exception if it's not initialized
            if (string.IsNullOrEmpty(dbFilePath))
            {
                throw new InvalidOperationException("Database path is not initialized. Call SetDatabasePath() method first.");
            }

            using (var connection = new SqliteConnection($"Data Source={dbFilePath};Version=3;"))
            {
                connection.Open();

                using (var command = new SqliteCommand(sqlQuery, connection))
                {
                    command.ExecuteNonQuery();
                }
            }
        }
    }
}