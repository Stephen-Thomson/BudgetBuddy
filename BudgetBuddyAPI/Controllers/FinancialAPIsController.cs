using Microsoft.AspNetCore.Mvc;
using System.Data.SQLite;

namespace BudgetBuddyAPI.Controllers
{
    [ApiController]
    public class FinancialAPIsController : ControllerBase
    {
        // Create a class to hold the data for a general journal post
        public class PostGJRequest
        {
            public DateTime Date { get; set; }
            public List<string> Accounts { get; set; }
            public List<string> Descriptions { get; set; }
            public List<string> Debits { get; set; }
            public List<string> Credits { get; set; }
        }

        // Create a class to hold the data of a single general journal entry
        public class GeneralJournalEntry
        {
            public DateTime Date { get; set; }
            public string Account { get; set; }
            public string Description { get; set; }
            public decimal Debit { get; set; }
            public decimal Credit { get; set; }
        }

        // Create a class to hold the data needed to create an account table
        public class CreateTableModel
        {
            public int Type { get; set; }
            public int Category { get; set; }
            public string AccountName { get; set; }
            public string Description { get; set; }
            public string Dvalue { get; set; }
            public string Cvalue { get; set; }
        }

        // Create a class to hold the data of a single account entry
        public class AccountEntry
        {
            public int Category { get; set; }
            public DateTime Date { get; set; }
            public string Description { get; set; }
            public decimal Debit { get; set; }
            public decimal Credit { get; set; }
            public decimal Total { get; set; }
        }

        // Create a class to hold the data for editing an account
        public class EditAccountModel
        {
            public string SelectedAccountName { get; set; }
            public string EditedAccountName { get; set; }
            public int Category { get; set; }
        }

        // Create a table to hold a single Totals Report entry
        public class TotalsReportEntry
        {
            public string AccountName { get; set; }
            public int Type { get; set; }
            public int Category { get; set; }
            public decimal Total { get; set; }
        }


        // POST: /api/postGJ
        // Post data to correct tables from a General Journal Post entry
        [HttpPost("/api/postGJ")]
        public IActionResult PostGJ([FromBody] PostGJRequest postData)
        {
            try
            {
                // Get the database path
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                //Console.WriteLine($"Database Path: {dbFilePath}");

                // Connect to the SQLite database
                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    //Console.WriteLine("Connection Open");
                    //Console.WriteLine($"Count: {postData.Accounts.Count}");

                    // Start a transaction in case of any problems that need to be rolled back
                    using (var transaction = connection.BeginTransaction())
                    {
                        try
                        {
                            // Loop through the accounts list
                            for (int i = 0; i < postData.Accounts.Count; i++)
                            {
                                // Construct a valid table name from the account name
                                string accountTableName = "Account_" + postData.Accounts[i].Replace(" ", "_");

                                //Console.WriteLine($"Account Table Name: {accountTableName}");

                                //Console.WriteLine($"Date: {postData.Date}");
                                //Console.WriteLine($"Description: {postData.Descriptions[i]}");

                                // Convert string representations to nullable decimal
                                decimal? debitNullable = ConvertToDecimal(postData.Debits[i]);
                                decimal? creditNullable = ConvertToDecimal(postData.Credits[i]);

                                // Convert nullable decimals to non-nullable decimals
                                decimal debit = debitNullable ?? 0; // If debitNullable is null, default to 0
                                decimal credit = creditNullable ?? 0; // If creditNullable is null, default to 0

                                // Convert string representations to decimal
                                //decimal debit = ConvertToDecimal(postData.Debits[i]) ?? 0.00m; // If ConvertToDecimal result is null, default to 0.00
                                //decimal credit = ConvertToDecimal(postData.Credits[i]) ?? 0.00m; // If ConvertToDecimal result is null, default to 0.00

                                //Console.WriteLine($"Debit: {debit}");
                                //Console.WriteLine($"Credit: {credit}");

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

                                // Create variables for accountType and total value
                                int accountType;
                                decimal total = 0;

                                // Retrieve Account type to determine which total calculation to call
                                using (var command = new SQLiteCommand($"SELECT Type FROM {accountTableName} WHERE Entry = 1;", connection, transaction))
                                {
                                    // Execute the command and retrieve the "Type" value
                                    object result = command.ExecuteScalar();

                                    // Check if the result is not null and convert it to an integer
                                    if (result != null && int.TryParse(result.ToString(), out accountType))
                                    {
                                        // Call the appropriate total calculation function based on the account type
                                        if (accountType == 1 || accountType == 3)
                                        {
                                            // Call monthly total calculation function and store the result in 'total'
                                            total = CalculateMonthlyTotal(accountTableName, postData.Date, accountType, debit, credit);
                                        }
                                        else if (accountType == 2 || accountType == 4)
                                        {
                                            // Call running total calculation function and store the result in 'total'
                                            total = CalculateRunningTotal(accountTableName, accountType, debit, credit);
                                        }
                                        else
                                        {
                                            // Error code
                                            Console.WriteLine("Unsupported account type or unexpected value for Type.");
                                        }
                                    }
                                    else
                                    {
                                        // Error code
                                        Console.WriteLine("Failed to retrieve account type or unexpected value for Type.");
                                    }
                                }

                                // Insert data into the specific account table
                                using (var command = new SQLiteCommand($"INSERT INTO {accountTableName} (Date, Description, Debit, Credit, Total) VALUES (@Date, @Description, @Debit, @Credit, @Total);", connection, transaction))
                                {
                                    command.Parameters.AddWithValue("@Date", postData.Date);
                                    command.Parameters.AddWithValue("@Description", postData.Descriptions[i]);
                                    command.Parameters.AddWithValue("@Debit", debit);
                                    command.Parameters.AddWithValue("@Credit", credit);
                                    command.Parameters.AddWithValue("@Total", total);

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

        // GET: /api/getGJ
        // Retreives and returns all entries in the general journal table
        [HttpGet("/api/getGJ")]
        public JsonResult GetGJ()
        {
            try
            {
                // Get database path
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                //Console.WriteLine($"Database Path: {dbFilePath}");

                // Connect to the SQLite database
                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    //Console.WriteLine("Connection Open");

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

        // POST: /api/createTable
        // Creates an account table from the passed in data
        [HttpPost("/api/createTable")]
        public IActionResult CreateTable([FromBody] CreateTableModel model)
        {
            try
            {
                // Get the database path
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                //Console.WriteLine($"Database Path: {dbFilePath}");

                // Connect to the SQLite database
                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    //Console.WriteLine("Connection Open");

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
                                              "Credit REAL," +
                                              "Total REAL)";

                    using (var command = new SQLiteCommand(createTableQuery, connection))
                    {
                        command.ExecuteNonQuery();
                    }

                    // Parse Dvalue and Cvalue as decimal values
                    decimal? debit = ConvertToDecimal(model.Dvalue);
                    decimal? credit = ConvertToDecimal(model.Cvalue);

                    // Determine the initial total based on the Type
                    decimal? initialTotal = null;
                    if (model.Type == 1 || model.Type == 4)
                    {
                        initialTotal = credit;
                    }
                    else if (model.Type == 2 || model.Type == 3)
                    {
                        initialTotal = debit;
                    }
                    else
                    {
                        // Error code
                        Console.WriteLine("Unsupported account type.");
                    }

                    // Insert the first entry into the table
                    string firstEntry = $"INSERT INTO {tableName} (Type, Category, Date, Description, Debit, Credit, Total) VALUES (@Type, @Category, @Date, @Description, @Debit, @Credit, @Total)";
                    using (var command = new SQLiteCommand(firstEntry, connection))
                    {
                        command.Parameters.AddWithValue("@Type", model.Type);
                        command.Parameters.AddWithValue("@Category", model.Category);
                        command.Parameters.AddWithValue("@Date", DateTime.Now);
                        command.Parameters.AddWithValue("@Description", model.Description);
                        command.Parameters.AddWithValue("@Debit", debit);
                        command.Parameters.AddWithValue("@Credit", credit);
                        command.Parameters.AddWithValue("@Total", initialTotal);

                        command.ExecuteNonQuery();
                    }

                    // Add new account to AccountsList
                    using (var command = new SQLiteCommand("INSERT INTO AccountsList (Account_Name, Table_Name) VALUES (@Account_Name, @Table_Name);", connection))
                    {
                        command.Parameters.AddWithValue("@Account_Name", model.AccountName);
                        command.Parameters.AddWithValue("@Table_Name", tableName);

                        command.ExecuteNonQuery();
                    }

                    // Return success
                    return Ok("Table created successfully.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: /api/getAccountEntries
        // Retreives the entries from the given account and returns them
        [HttpGet("/api/getAccountEntries")]
        public JsonResult GetAccountEntries([FromQuery] string accountName)
        {
            try
            {
                // Get database path
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                Console.WriteLine($"Database Path: {dbFilePath}");

                // Connect to the SQLite database
                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    //Console.WriteLine("Connection Open");

                    // Create the valid account table name
                    string accountTableName = $"Account_{accountName.Replace(" ", "_")}";
                    //Console.WriteLine($"Account Table Name: {accountTableName}");

                    // Fetch data from the specified account table, including the Total column
                    var query = $"SELECT Category, Date, Description, Debit, Credit, Total FROM {accountTableName}";
                    using (var command = new SQLiteCommand(query, connection))
                    {
                        using (var reader = command.ExecuteReader())
                        {
                            // Create a list to hold the rows
                            var rows = new List<AccountEntry>();

                            while (reader.Read())
                            {
                                // Read data from the reader and create an AccountEntry object
                                var entry = new AccountEntry
                                {
                                    Category = reader.IsDBNull(0) ? 0 : reader.GetInt32(0),
                                    Date = reader.GetDateTime(1),
                                    Description = reader.GetString(2),
                                    Debit = reader.GetDecimal(3),
                                    Credit = reader.GetDecimal(4),
                                    Total = reader.GetDecimal(5) // Set the Total property
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
                            //Console.WriteLine("JSON Response:");
                            //Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(responseData, new System.Text.Json.JsonSerializerOptions { WriteIndented = true }));

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

        // POST: /api/editAccount
        // Updates an account table with the passed in data
        [HttpPost("/api/editAccount")]
        public IActionResult EditAccount([FromBody] EditAccountModel model)
        {
            try
            {
                // Get the database path
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                //Console.WriteLine($"Database Path: {dbFilePath}");

                // Connect to the SQLite database
                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    //Console.WriteLine("Connection Open");

                    // Create the account table name
                    string accountTableName = $"Account_{model.SelectedAccountName.Replace(" ", "_")}";

                    Console.WriteLine("Check 1");
                    // Check if the account name has been edited
                    if (model.SelectedAccountName == model.EditedAccountName || string.IsNullOrEmpty(model.EditedAccountName))
                    {
                        // Account name has not been edited, update the account table with the category
                        string updateQuery = $"UPDATE {accountTableName} SET Category = @Category WHERE Entry = 1";

                        using (var command = new SQLiteCommand(updateQuery, connection))
                        {
                            command.Parameters.AddWithValue("@Category", model.Category);
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

        // Creates a table with the new account name and copies all data from the old account table
        private void EditName(EditAccountModel model, string accountTableName)
        {
            try
            {
                // Get database path
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                //Console.WriteLine($"Database Path: {dbFilePath}");

                // Connect to the SQLite database
                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    //Console.WriteLine("Connection Open");

                    // Use transaction in case any rollback is needed
                    using (var transaction = connection.BeginTransaction())
                    {
                        try
                        {
                            // Create the new table name
                            string editedTableName = $"Account_{model.EditedAccountName.Replace(" ", "_")}";
                            Console.WriteLine("Check 2");
                            // Create the new table in the database
                            string createTableQuery = $"CREATE TABLE IF NOT EXISTS {editedTableName} (" +
                                                      "Entry INTEGER PRIMARY KEY AUTOINCREMENT," +
                                                      "Type INT," +
                                                      "Category INT," +
                                                      "Date DATE," +
                                                      "Description TEXT," +
                                                      "Debit REAL," +
                                                      "Credit REAL," +
                                                      "Total REAL)";

                            using (var createTableCommand = new SQLiteCommand(createTableQuery, connection))
                            {
                                Console.WriteLine("Check 3");
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

                            // Commit the transaction if all operations succeed
                            transaction.Commit(); 
                            //Console.WriteLine("Account Updated successfully.");
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

        // Calculates the totals for a given account, month, and year for reports
        private TotalsReportEntry TotalsPerMonth(int month, int year, string accountTableName)
        {
            try
            {
                // Get database path
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                //Console.WriteLine($"Database Path: {dbFilePath}");

                // Connect to the SQLite database
                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    //Console.WriteLine("Connection Open");

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
                        // Retrieves total amount in the final entry of the table
                        var totalQuery = $"SELECT Total FROM {accountTableName} ORDER BY Entry DESC LIMIT 1";

                        using (var totalCommand = new SQLiteCommand(totalQuery, connection))
                        {
                            var result = totalCommand.ExecuteScalar();
                            if (result != null && decimal.TryParse(result.ToString(), out decimal lastTotal))
                            {
                                total = lastTotal;
                            }
                        }
                    }
                    else if (type == 1 || type == 3) // Income or Expense account
                    {
                        // Retrieves and calculates totals for given month
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

        // GET: /api/getTotals
        // Retrieves all totals for the given month and year for reports
        [HttpGet("/api/getTotals")]
        public JsonResult GetTotals(int month, int year)
        {
            try
            {
                // Get database path
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                //Console.WriteLine($"Database Path: {dbFilePath}");

                // Connect to the SQLite database
                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    //Console.WriteLine("Connection Open");

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

                return new JsonResult(new { success = false, message = "Internal server error." });
            }
        }

        // GET: /api/getAverages
        // Calculates the average totals for reports
        [HttpGet("/api/getAverages")]
        public JsonResult GetAverages()
        {
            try
            {
                // Get database path
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                //Console.WriteLine($"Database Path: {dbFilePath}");

                // Connect to the SQLite database
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

                            // Process each account name
                            foreach (var accountTableName in accountNameList)
                            {
                                // Fetch the Type from the specified accountTableName
                                var accountTypeQuery = $"SELECT Type FROM {accountTableName} LIMIT 1";

                                int type = 0;

                                using (var typeCommand = new SQLiteCommand(accountTypeQuery, connection))
                                {
                                    object result = typeCommand.ExecuteScalar();
                                    if (result != null && int.TryParse(result.ToString(), out type))
                                    {
                                        // Check if the account type is 2 (Asset) or 4 (Accounts Payable)
                                        if (type == 2 || type == 4)
                                        {
                                            // Retrieve the total from the last entry
                                            var totalQuery = $"SELECT Total FROM {accountTableName} ORDER BY Entry DESC LIMIT 1";

                                            using (var totalCommand = new SQLiteCommand(totalQuery, connection))
                                            {
                                                object totalResult = totalCommand.ExecuteScalar();
                                                if (totalResult != null && decimal.TryParse(totalResult.ToString(), out decimal total))
                                                {
                                                    // Create a TotalsReportEntry with the total
                                                    var totalReportEntry = new TotalsReportEntry
                                                    {
                                                        AccountName = accountTableName,
                                                        Type = type,
                                                        Category = 1,
                                                        Total = total
                                                    };

                                                    // Add the result to the list
                                                    averagesList.Add(totalReportEntry);
                                                }
                                            }
                                        }
                                        else
                                        {
                                            // Calculate average total for other account types (1 and 3)
                                            // Initialize variables for calculating average total
                                            decimal total = 0;
                                            int monthsWithValues = 0;
                                            int category = 0;

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

                                            //Console.WriteLine($"Start Month: {startMonth}");

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

                                                // Set category
                                                category = totalsReportEntry.Category;

                                                // Check if the total is greater than 0
                                                if (totalsReportEntry.Total > 0)
                                                {
                                                    total += totalsReportEntry.Total;
                                                    monthsWithValues++;
                                                }
                                                //Console.WriteLine($"Total: {totalsReportEntry.Total}");
                                            }

                                            //Console.WriteLine($"To Average: {total}");
                                            //Console.WriteLine($"Months with values: {monthsWithValues}");
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
                                    }
                                    else
                                    {
                                        // Error code
                                        Console.WriteLine($"Failed to retrieve account type for {accountTableName}.");
                                    }
                                }
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
                // Error Code
                Console.Error.WriteLine($"GetAverages error: {ex.Message}");

                return new JsonResult(new { success = false, message = "Internal server error." });
            }
        }

        // Calculate the monthly total for the given account - returns decimal for insertion into total column
        decimal CalculateMonthlyTotal(string accountTableName, DateTime date, int type, decimal newDebit, decimal newCredit)
        {
            // Get database path
            string dbFilePath = DatabasePathManager.GetDatabasePath();

            // Connect to the SQLite database
            using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
            {
                try
                {
                    connection.Open();

                    // Set month and year variables
                    int month = date.Month;
                    int year = date.Year;

                    // Select the sum of debit and credit for given account, month, year
                    string monthlyTotalQuery = $"SELECT SUM(Credit) AS TotalCredit, SUM(Debit) AS TotalDebit FROM {accountTableName} WHERE strftime('%Y-%m', Date) = @YearMonth";

                    using (var command = new SQLiteCommand(monthlyTotalQuery, connection))
                    {
                        command.Parameters.AddWithValue("@YearMonth", $"{year}-{month.ToString("D2")}");

                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                // Convert to decimal
                                decimal totalCredit = Convert.ToDecimal(reader["TotalCredit"]);
                                decimal totalDebit = Convert.ToDecimal(reader["TotalDebit"]);

                                decimal total = 0;
                                if (type == 1)
                                {
                                    total = totalCredit - totalDebit + newCredit - newDebit;
                                }
                                else if (type == 3)
                                {
                                    total = totalDebit - totalCredit + newDebit - newCredit;
                                }
                                else
                                {
                                    Console.WriteLine("Unsupported account type.");
                                }

                                return total;
                            }
                            else
                            {
                                Console.WriteLine("No data found for the specified month and year.");
                                return 0;
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"An error occurred: {ex.Message}");
                    return 0;
                }
            }
        }

        // Calculates running total for new entry into asset or credit account
        decimal CalculateRunningTotal(string accountTableName, int type, decimal debit, decimal credit)
        {
            // Get database path
            string dbFilePath = DatabasePathManager.GetDatabasePath();

            // Connect to the SQLite database
            using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
            {
                try
                {
                    connection.Open();

                    // SQL command to retrieve the value of the Total column from the last entry
                    string lastTotalQuery = $"SELECT Total FROM {accountTableName} ORDER BY Entry DESC LIMIT 1";

                    using (var command = new SQLiteCommand(lastTotalQuery, connection))
                    {
                        // Retrieve the value of the Total column from the last entry
                        object result = command.ExecuteScalar();

                        // Convert the result to a decimal if it's not null
                        decimal currentTotal = result != null ? Convert.ToDecimal(result) : 0;

                        // Calculate the new total based on the account type
                        decimal newTotal = 0;
                        if (type == 2) // Asset
                        {
                            // Type 2: Add debit value and subtract credit value
                            newTotal = currentTotal + debit - credit;
                        }
                        else if (type == 4) // Credit
                        {
                            // Type 4: Add credit value and subtract debit value
                            newTotal = currentTotal + credit - debit;
                        }
                        else
                        {
                            Console.WriteLine("Unsupported account type.");
                            return 0;
                        }

                        return newTotal;
                    }
                }
                catch (Exception ex)
                {
                    // Handle any exceptions
                    Console.WriteLine($"An error occurred: {ex.Message}");
                    return 0;
                }
            }
        }

    }
}