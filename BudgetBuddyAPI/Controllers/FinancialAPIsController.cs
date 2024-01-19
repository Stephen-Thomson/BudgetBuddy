using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Data.SQLite;
using System.IO;
using Microsoft.Extensions.FileProviders;
using System.Security.Cryptography;
using System.Text;
using BCrypt.Net;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace BudgetBuddyAPI.Controllers
{
    [ApiController]
    public class FinancialAPIsController : ControllerBase
    {
        // POST General Journal entries
        [HttpPost("/api/postGJ")]
        public IActionResult PostGJ(
            [FromQuery] DateTime date,
            [FromQuery] List<string> accounts,
            [FromQuery] List<string> descriptions,
            [FromQuery] List<decimal?> debits,
            [FromQuery] List<decimal?> credits)
        {
            try
            {
                string dbFilePath = DatabasePathManager.GetDatabasePath();

                using(var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))

                {
                    connection.Open();

                    using (var transaction = connection.BeginTransaction())
                    {
                        try
                        {
                            for (int i = 0; i < accounts.Count; i++)
                            {
                                string accountTableName = "Account_" + accounts[i];

                                // Insert row into General Journal
                                using (var command = new SQLiteCommand("INSERT INTO General_Journal (Date, Account, Description, Debit, Credit) VALUES (@Date, @Account, @Description, @Debit, @Credit);", connection, transaction))
                                {
                                    command.Parameters.AddWithValue("@Date", date);
                                    command.Parameters.AddWithValue("@Account", accounts[i]);
                                    command.Parameters.AddWithValue("@Description", descriptions[i]);
                                    command.Parameters.AddWithValue("@Debit", debits[i]);
                                    command.Parameters.AddWithValue("@Credit", credits[i]);

                                    command.ExecuteNonQuery();
                                }

                                // Insert data into the specific account table
                                using (var command = new SQLiteCommand($"INSERT INTO {accountTableName} (Date, Description, Debit, Credit) VALUES (@Date, @Description, @Debit, @Credit);", connection, transaction))
                                {
                                    command.Parameters.AddWithValue("@Date", date);
                                    command.Parameters.AddWithValue("@Description", descriptions[i]);
                                    command.Parameters.AddWithValue("@Debit", debits[i]);
                                    command.Parameters.AddWithValue("@Credit", credits[i]);

                                    command.ExecuteNonQuery();
                                }
                            }

                            // Commit the transaction if everything is successful
                            transaction.Commit();

                            // Return success response
                            return Ok(new { success = true, message = "Entries posted successfully." });
                        }
                        catch (Exception ex)
                        {
                            // Rollback the transaction in case of an exception
                            transaction.Rollback();

                            Console.Error.WriteLine($"PostGJ error: {ex.Message}");

                            // Return an error response
                            return StatusCode(500, new { success = false, message = "Internal server error." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the error
                // Consider using a proper logging framework here
                Console.Error.WriteLine($"PostGJ error: {ex.Message}");

                // Return an error response
                return StatusCode(500, new { success = false, message = "Internal server error." });
            }

        }

    }

}