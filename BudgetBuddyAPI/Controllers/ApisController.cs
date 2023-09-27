using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SQLite;
using System.Linq;

namespace BudgetBuddyAPI.Controllers
{
    [ApiController]
    public class ApisController : ControllerBase
    {
        // GET: /api/getaccounts
        [HttpGet("/api/getAccounts")]
        public IActionResult GetAccounts()
        {
            try
            {
                string dbFilePath = null;
                dbFilePath = DatabasePathManager.GetDatabasePath();

                // Create a list to store the account names
                List<string> accountNames = new List<string>();

                if (string.IsNullOrEmpty(dbFilePath))
                {
                    return BadRequest("Database path is not initialized.");
                }

                // Connect to the SQLite database
                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();

                    // Query to retrieve account names from the AccountsList table
                    using (var command = new SQLiteCommand("SELECT Account_Name FROM AccountsList", connection))
                    {
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                string accountName = reader.GetString(0);
                                accountNames.Add(accountName);
                            }
                        }
                    }
                }

                // Alphabetize the account names
                accountNames.Sort();

                return Ok(accountNames);
            }
            catch (Exception ex)
            {
                // Handle any exceptions here
                return BadRequest($"An error occurred: {ex.Message}");
            }
        }
    }
}
