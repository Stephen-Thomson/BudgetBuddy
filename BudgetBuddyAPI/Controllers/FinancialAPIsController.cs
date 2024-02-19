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
using System.Data.Entity;
using static BudgetBuddyAPI.Controllers.FinancialAPIsController;

namespace BudgetBuddyAPI.Controllers
{
    [ApiController]
    public class FinancialAPIsController : ControllerBase
    {
        public class PostGJRequest
        {
            public DateTime Date { get; set; }
            public List<string> Accounts { get; set; }
            public List<string> Descriptions { get; set; }
            public List<string> Debits { get; set; }
            public List<string> Credits { get; set; }
        }

        public class GeneralJournalEntry
        {
            public DateTime Date { get; set; }
            public string Account { get; set; }
            public string Description { get; set; }
            public decimal Debit { get; set; }
            public decimal Credit { get; set; }
        }

        public class CreateTableModel
        {
            public int Type { get; set; }
            public int Category { get; set; }
            public string AccountName { get; set; }
            public string Description { get; set; }
            public string Dvalue { get; set; }
            public string Cvalue { get; set; }
        }

        public class AccountEntry
        {
            public int Category { get; set; }
            public DateTime Date { get; set; }
            public string Description { get; set; }
            public decimal Debit { get; set; }
            public decimal Credit { get; set; }
        }

        public class EditAccountModel
        {
            public string SelectedAccountName { get; set; }
            public string EditedAccountName { get; set; }
            public int Category { get; set; }
        }

        public class TotalsReportEntry
        {
            public string AccountName { get; set; }
            public int Type { get; set; }
            public int Category { get; set; }
            public decimal Total { get; set; }
        }



        [HttpPost("/api/postGJ")]
        public IActionResult PostGJ([FromBody] PostGJRequest postData)
        {
            try
            {
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                Console.WriteLine($"Database Path: {dbFilePath}");

                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    Console.WriteLine("Connection Open");
                    Console.WriteLine($"Count: {postData.Accounts.Count}");

                    using (var transaction = connection.BeginTransaction())
                    {
                        try
                        {
                            for (int i = 0; i < postData.Accounts.Count; i++)
                            {
                                string accountTableName = "Account_" + postData.Accounts[i].Replace(" ", "_");

                                Console.WriteLine($"Account Table Name: {accountTableName}");

                                Console.WriteLine($"Date: {postData.Date}");
                                Console.WriteLine($"Description: {postData.Descriptions[i]}");

                                // Convert string representations to decimal
                                decimal? debit = ConvertToDecimal(postData.Debits[i]);
                                decimal? credit = ConvertToDecimal(postData.Credits[i]);

                                Console.WriteLine($"Debit: {debit}");
                                Console.WriteLine($"Credit: {credit}");

                                // Insert row into General Journal
                                using (var command = new SQLiteCommand("INSERT INTO General_Journal (Date, Account, Description, Debit, Credit) VALUES (@Date, @Account, @Description, @Debit, @Credit);", connection, transaction))
                                {
                                    command.Parameters.AddWithValue("@Date", postData.Date);
                                    command.Parameters.AddWithValue("@Account", postData.Accounts[i]);
                                    command.Parameters.AddWithValue("@Description", postData.Descriptions[i]);
                                    command.Parameters.AddWithValue("@Debit", debit);
                                    command.Parameters.AddWithValue("@Credit", credit);

                                    command.ExecuteNonQuery();
                                }

                                // Insert data into the specific account table
                                using (var command = new SQLiteCommand($"INSERT INTO {accountTableName} (Date, Description, Debit, Credit) VALUES (@Date, @Description, @Debit, @Credit);", connection, transaction))
                                {
                                    command.Parameters.AddWithValue("@Date", postData.Date);
                                    command.Parameters.AddWithValue("@Description", postData.Descriptions[i]);
                                    command.Parameters.AddWithValue("@Debit", debit);
                                    command.Parameters.AddWithValue("@Credit", credit);

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
                Console.Error.WriteLine($"PostGJ error: {ex.Message}");

                // Return an error response
                return StatusCode(500, new { success = false, message = "Internal server error." });
            }
        }

        // Helper method to convert string to decimal
        private decimal? ConvertToDecimal(string input)
        {
            // Remove '$' sign, if present
            string cleanedInput = input.Replace("$", "");

            if (decimal.TryParse(cleanedInput, out decimal result))
            {
                return result;
            }
            return null;
        }

        [HttpGet("/api/getGJ")]
        public JsonResult GetGJ()
        {
            try
            {
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                Console.WriteLine($"Database Path: {dbFilePath}");

                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    Console.WriteLine("Connection Open");

                    // Fetch data from the General_Journal table
                    var query = "SELECT Date, Account, Description, Debit, Credit FROM General_Journal";
                    using (var command = new SQLiteCommand(query, connection))
                    {
                        using (var reader = command.ExecuteReader())
                        {
                            // Create a list to hold the rows
                            var rows = new List<GeneralJournalEntry>();

                            while (reader.Read())
                            {
                                // Read data from the reader and create a GeneralJournalEntry object
                                var entry = new GeneralJournalEntry
                                {
                                    Date = reader.GetDateTime(0),
                                    Account = reader.GetString(1),
                                    Description = reader.GetString(2),
                                    Debit = reader.GetDecimal(3),
                                    Credit = reader.GetDecimal(4)
                                };

                                // Add the entry to the list
                                rows.Add(entry);
                            }

                            // Create a response object
                            var responseData = new
                            {
                                rows
                            };

                            // Return the response
                            return new JsonResult(Ok(responseData));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the error
                Console.Error.WriteLine($"GetGJ error: {ex.Message}");

                // Return an error response
                return new JsonResult(new { success = false, message = "Internal server error." });

            }
        }

        [HttpPost("/api/createTable")]
        public IActionResult CreateTable([FromBody] CreateTableModel model)
        {
            try
            {
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                Console.WriteLine($"Database Path: {dbFilePath}");

                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    Console.WriteLine("Connection Open");

                    // Create a unique table name with spaces replaced by underscores
                    string tableName = $"Account_{model.AccountName.Replace(" ", "_")}";

                    // Create the table in the database
                    string createTableQuery = $"CREATE TABLE IF NOT EXISTS {tableName} (" +
                                              "Entry INTEGER PRIMARY KEY AUTOINCREMENT," +
                                              "Type INT," +
                                              "Category INT," +
                                              "Date DATE," +
                                              "Description TEXT," +
                                              "Debit REAL," +
                                              "Credit REAL)";

                    using (var command = new SQLiteCommand(createTableQuery, connection))
                    {
                        command.ExecuteNonQuery();
                    }

                    // Parse Dvalue and Cvalue as decimal values
                    decimal? debit = ConvertToDecimal(model.Dvalue);
                    decimal? credit = ConvertToDecimal(model.Cvalue);

                    // Insert the first entry into the table
                    string firstEntry = $"INSERT INTO {tableName} (Type, Category, Date, Description, Debit, Credit) VALUES (@Type, @Category, @Date, @Description, @Debit, @Credit)";
                    using (var command = new SQLiteCommand(firstEntry, connection))
                    {
                        command.Parameters.AddWithValue("@Type", model.Type);
                        command.Parameters.AddWithValue("@Category", model.Category);
                        command.Parameters.AddWithValue("@Date", DateTime.Now);
                        command.Parameters.AddWithValue("@Description", model.Description);
                        command.Parameters.AddWithValue("@Debit", debit);
                        command.Parameters.AddWithValue("@Credit", credit);

                        command.ExecuteNonQuery();
                    }

                    using (var command = new SQLiteCommand("INSERT INTO AccountsList (Account_Name, Table_Name) VALUES (@Account_Name, @Table_Name);", connection))
                    {
                        command.Parameters.AddWithValue("@Account_Name", model.AccountName);
                        command.Parameters.AddWithValue("@Table_Name", tableName);

                        command.ExecuteNonQuery();
                    }

                    return Ok("Table created successfully.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("/api/getAccountEntries")]
        public JsonResult GetAccountEntries([FromQuery] string accountName)
        {
            try
            {
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                Console.WriteLine($"Database Path: {dbFilePath}");

                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    Console.WriteLine("Connection Open");

                    // Create the account table name
                    string accountTableName = $"Account_{accountName.Replace(" ", "_")}";
                    Console.WriteLine($"Account Table Name: {accountTableName}");

                    // Fetch data from the General_Journal table
                    var query = $"SELECT Category, Date, Description, Debit, Credit FROM {accountTableName}";
                    using (var command = new SQLiteCommand(query, connection))
                    {
                        using (var reader = command.ExecuteReader())
                        {
                            // Create a list to hold the rows
                            var rows = new List<AccountEntry>();

                            while (reader.Read())
                            {
                                for (int i = 0; i < reader.FieldCount; i++)
                                {
                                    Console.WriteLine($"Column {i}: {reader.GetName(i)}, Type: {reader.GetFieldType(i)}, Value: {reader.GetValue(i)}");
                                }
                                // Read data from the reader and create a GeneralJournalEntry object
                                var entry = new AccountEntry
                                {
                                    Category = reader.IsDBNull(0) ? 0 : reader.GetInt32(0),
                                    Date = reader.GetDateTime(1),
                                    Description = reader.GetString(2),
                                    Debit = reader.GetDecimal(3),
                                    Credit = reader.GetDecimal(4)
                                };

                                // Add the entry to the list
                                rows.Add(entry);
                            }

                            // Create a response object
                            var responseData = new
                            {
                                rows
                            };

                            // Print the JSON response to the console
                            Console.WriteLine("JSON Response:");
                            Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(responseData, new System.Text.Json.JsonSerializerOptions { WriteIndented = true }));

                            // Return the response
                            return new JsonResult(Ok(responseData));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the detailed error information
                Console.Error.WriteLine($"GetAccountEntries error: {ex.ToString()}");

                // Return an error response
                return new JsonResult(new { success = false, message = "Internal server error." });

            }
        }

        [HttpPost("/api/editAccount")]
        public IActionResult EditAccount([FromBody] EditAccountModel model)
        {
            try
            {
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                Console.WriteLine($"Database Path: {dbFilePath}");

                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    Console.WriteLine("Connection Open");

                    // Create the account table name
                    string accountTableName = $"Account_{model.SelectedAccountName.Replace(" ", "_")}";

                    if (model.SelectedAccountName == model.EditedAccountName || string.IsNullOrEmpty(model.EditedAccountName))
                    {
                        var updateQuery = $"UPDATE {accountTableName} SET Category = {model.Category} WHERE Entry = 1";

                        using (var command = new SQLiteCommand(updateQuery, connection))
                        {
                            // Execute the update query
                            command.ExecuteNonQuery();
                        }
                    }
                    else
                    {
                        // Call the helper function to edit the name
                        EditName(model, accountTableName);
                    }

                    return Ok("Account Updated successfully.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private void EditName(EditAccountModel model, string accountTableName)
        {
            try
            {
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                Console.WriteLine($"Database Path: {dbFilePath}");

                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    Console.WriteLine("Connection Open");

                    using (var transaction = connection.BeginTransaction())
                    {
                        try
                        {
                            // Create the new table name
                            string editedTableName = $"Account_{model.EditedAccountName.Replace(" ", "_")}";

                            // Create the new table in the database
                            string createTableQuery = $"CREATE TABLE IF NOT EXISTS {editedTableName} (" +
                                                      "Entry INTEGER PRIMARY KEY AUTOINCREMENT," +
                                                      "Type INT," +
                                                      "Category INT," +
                                                      "Date DATE," +
                                                      "Description TEXT," +
                                                      "Debit REAL," +
                                                      "Credit REAL)";

                            using (var createTableCommand = new SQLiteCommand(createTableQuery, connection))
                            {
                                createTableCommand.ExecuteNonQuery();
                            }

                            // Copy data from the old table to the new table
                            string copyDataQuery = $"INSERT INTO {editedTableName} SELECT * FROM {accountTableName}";

                            using (var copyDataCommand = new SQLiteCommand(copyDataQuery, connection))
                            {
                                copyDataCommand.ExecuteNonQuery();
                            }

                            // Drop the old table
                            string dropOldTableQuery = $"DROP TABLE IF EXISTS {accountTableName}";

                            using (var dropOldTableCommand = new SQLiteCommand(dropOldTableQuery, connection))
                            {
                                dropOldTableCommand.ExecuteNonQuery();
                            }

                            // Update the Category column in Entry 1 for the new table
                            string updateCategoryQuery = $"UPDATE {editedTableName} SET Category = {model.Category} WHERE Entry = 1";

                            using (var updateCategoryCommand = new SQLiteCommand(updateCategoryQuery, connection))
                            {
                                updateCategoryCommand.ExecuteNonQuery();
                            }

                            // Update the AccountsList table
                            string updateAccountsListQuery = $"UPDATE AccountsList SET Account_Name = '{model.EditedAccountName}', Table_Name = '{editedTableName}' WHERE Account_Name = '{model.SelectedAccountName}'";

                            using (var updateAccountsListCommand = new SQLiteCommand(updateAccountsListQuery, connection))
                            {
                                updateAccountsListCommand.ExecuteNonQuery();
                            }

                            transaction.Commit(); // Commit the transaction if all operations succeed
                            Console.WriteLine("Account Updated successfully.");
                        }
                        catch (Exception ex)
                        {
                            // Rollback the transaction if any operation fails
                            transaction.Rollback();
                            Console.Error.WriteLine($"Error during table rename transaction: {ex.Message}");
                            // Re-throw the exception to propagate it up
                            throw;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Internal server error: {ex.Message}");
                // Log or handle the error as needed
            }
        }

        private TotalsReportEntry TotalsPerMonth(int month, int year, string accountTableName)
        {
            try
            {
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                Console.WriteLine($"Database Path: {dbFilePath}");

                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    Console.WriteLine("Connection Open");

                    // Fetch the Type and Category from the specified accountTableName
                    var accountTypeAndCategoryQuery = $"SELECT Type, Category FROM {accountTableName} LIMIT 1";

                    int type = 0;
                    int category = 0;

                    using (var typeCategoryCommand = new SQLiteCommand(accountTypeAndCategoryQuery, connection))
                    {
                        using (var typeCategoryReader = typeCategoryCommand.ExecuteReader())
                        {
                            if (typeCategoryReader.Read())
                            {
                                type = typeCategoryReader.GetInt32(0);
                                category = typeCategoryReader.GetInt32(1);
                            }
                        }
                    }

                    // Initialize variables for calculating the total
                    decimal total = 0;

                    // Fetch data based on account type
                    if (type == 2 || type == 4) // Asset or Accounts Payable account
                    {
                        var assetOrPayableQuery = $"SELECT Debit, Credit FROM {accountTableName}";

                        using (var assetOrPayableCommand = new SQLiteCommand(assetOrPayableQuery, connection))
                        {
                            using (var assetOrPayableReader = assetOrPayableCommand.ExecuteReader())
                            {
                                while (assetOrPayableReader.Read())
                                {
                                    decimal debit = assetOrPayableReader.GetDecimal(0);
                                    decimal credit = assetOrPayableReader.GetDecimal(1);

                                    if (type == 2)
                                        total += debit - credit; // Asset account
                                    else
                                        total += credit - debit; // Accounts Payable account
                                }
                            }
                        }
                    }
                    else if (type == 1 || type == 3) // Income or Expense account
                    {
                        var incomeOrExpenseQuery = $"SELECT Debit, Credit FROM {accountTableName} WHERE strftime('%Y-%m', Date) = '{year}-{month:D2}'";

                        using (var incomeOrExpenseCommand = new SQLiteCommand(incomeOrExpenseQuery, connection))
                        {
                            using (var incomeOrExpenseReader = incomeOrExpenseCommand.ExecuteReader())
                            {
                                while (incomeOrExpenseReader.Read())
                                {
                                    decimal debit = incomeOrExpenseReader.GetDecimal(0);
                                    decimal credit = incomeOrExpenseReader.GetDecimal(1);

                                    if (type == 1)
                                        total += credit - debit; // Income account
                                    else
                                        total += debit - credit; // Expense account
                                }
                            }
                        }
                    }

                    // Fetch the AccountName from the AccountsList table
                    var accountNameQuery = $"SELECT Account_Name FROM AccountsList WHERE Table_Name = '{accountTableName}' LIMIT 1";

                    string accountName = "";

                    using (var accountNameCommand = new SQLiteCommand(accountNameQuery, connection))
                    {
                        using (var accountNameReader = accountNameCommand.ExecuteReader())
                        {
                            if (accountNameReader.Read())
                            {
                                accountName = accountNameReader.GetString(0);
                            }
                        }
                    }

                    // Create and return the TotalsReportEntry
                    var totalsReportEntry = new TotalsReportEntry
                    {
                        AccountName = accountName,
                        Type = type,
                        Category = category,
                        Total = total
                    };

                    return totalsReportEntry;
                }
            }
            catch (Exception ex)
            {
                // Log the error
                Console.Error.WriteLine($"TotalsPerMonth error: {ex.Message}");

                // Return an error response
                return new TotalsReportEntry();
            }
        }

        [HttpGet("/api/getTotals")]
        public JsonResult GetTotals(int month, int year)
        {
            try
            {
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                Console.WriteLine($"Database Path: {dbFilePath}");

                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    Console.WriteLine("Connection Open");

                    // Fetch all account names from the AccountsList table
                    var accountNamesQuery = "SELECT Table_Name FROM AccountsList";

                    using (var accountNamesCommand = new SQLiteCommand(accountNamesQuery, connection))
                    {
                        using (var accountNamesReader = accountNamesCommand.ExecuteReader())
                        {
                            // Create a list to hold account names
                            var accountNameList = new List<string>();

                            while (accountNamesReader.Read())
                            {
                                string accountTableName = accountNamesReader.GetString(0);
                                accountNameList.Add(accountTableName);
                            }

                            // Alphabetize the list of account names
                            accountNameList.Sort();

                            // Create a list to hold TotalsReportEntry for each account
                            var totalsList = new List<TotalsReportEntry>();

                            // Process each account name
                            foreach (var accountTableName in accountNameList)
                            {
                                // Call the TotalsPerMonth helper function
                                var totalsReportEntry = TotalsPerMonth(month, year, accountTableName);

                                // Add the result to the list
                                totalsList.Add(totalsReportEntry);
                            }

                            // Create a response object
                            var responseData = new
                            {
                                totalsList
                            };

                            // Return the response
                            return new JsonResult(Ok(responseData));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the error
                Console.Error.WriteLine($"GetTotals error: {ex.Message}");

                // Return an error response
                return new JsonResult(new { success = false, message = "Internal server error." });
            }
        }

        [HttpGet("/api/getAverages")]
        public JsonResult GetAverages()
        {
            try
            {
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                Console.WriteLine($"Database Path: {dbFilePath}");

                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    Console.WriteLine("Connection Open");

                    // Fetch all account names from the AccountsList table
                    var accountNamesQuery = "SELECT Table_Name FROM AccountsList";

                    using (var accountNamesCommand = new SQLiteCommand(accountNamesQuery, connection))
                    {
                        using (var accountNamesReader = accountNamesCommand.ExecuteReader())
                        {
                            // Create a list to hold account names
                            var accountNameList = new List<string>();

                            while (accountNamesReader.Read())
                            {
                                string accountTableName = accountNamesReader.GetString(0);
                                accountNameList.Add(accountTableName);
                            }

                            // Alphabetize the list of account names
                            accountNameList.Sort();

                            // Create a list to hold averaged TotalsReportEntry for each account
                            var averagesList = new List<TotalsReportEntry>();

                            // Get the current month and year
                            var currentDate = DateTime.Now;
                            var currentMonth = currentDate.Month;
                            var currentYear = currentDate.Year;

                            // Calculate the start month (previous six months)
                            var startMonth = currentMonth - 6;
                            if (startMonth <= 0)
                            {
                                startMonth += 12;
                                currentYear--; // Adjust the year if start month is in the previous year
                            }

                            Console.WriteLine($"Start Month: {startMonth}");

                            // Process each account name
                            foreach (var accountTableName in accountNameList)
                            {
                                // Initialize variables for calculating average total
                                decimal total = 0;
                                int monthsWithValues = 0;
                                int type = 0;
                                int category = 0;

                                // Calculate average total over previous six months
                                for (int i = 0; i < 6; i++)
                                {
                                    var monthToCalculate = startMonth + i;
                                    var yearToCalculate = currentYear;
                                    if (monthToCalculate > 12)
                                    {
                                        monthToCalculate -= 12;
                                        yearToCalculate++;
                                    }

                                    // Call the TotalsPerMonth helper function
                                    var totalsReportEntry = TotalsPerMonth(monthToCalculate, yearToCalculate, accountTableName);

                                    // Set type and category
                                    type = totalsReportEntry.Type;
                                    category = totalsReportEntry.Category;

                                    // Check if the total is greater than 0
                                    if (totalsReportEntry.Total > 0)
                                    {
                                        total += totalsReportEntry.Total;
                                        monthsWithValues++;
                                    }
                                    Console.WriteLine($"Total: {totalsReportEntry.Total}");
                                }

                                Console.WriteLine($"To Average: {total}");
                                Console.WriteLine($"Months with values: {monthsWithValues}");
                                // Calculate average total
                                decimal averageTotal = monthsWithValues > 0 ? total / monthsWithValues : 0;

                                // Create a TotalsReportEntry with the averaged total
                                var averagesReportEntry = new TotalsReportEntry
                                {
                                    AccountName = accountTableName,
                                    Type = type,
                                    Category = category,
                                    Total = averageTotal
                                };

                                // Add the result to the list
                                averagesList.Add(averagesReportEntry);
                            }

                            // Create a response object
                            var responseData = new
                            {
                                averagesList
                            };

                            // Return the response
                            return new JsonResult(Ok(responseData));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the error
                Console.Error.WriteLine($"GetAverages error: {ex.Message}");

                // Return an error response
                return new JsonResult(new { success = false, message = "Internal server error." });
            }
        }




    }
}