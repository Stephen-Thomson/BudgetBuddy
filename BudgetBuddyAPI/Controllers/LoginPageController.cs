using Microsoft.AspNetCore.Mvc;
using System.Data.SQLite;


namespace BudgetBuddyAPI.Controllers
{
    [ApiController]
    public class LoginPageController : ControllerBase
    {
        // GET: /api/handlelogin
        // Perform the login logic and return appropriate responses
        [HttpGet("/api/handlelogin")]
        public IActionResult HandleLogin([FromQuery] string username, [FromQuery] string password)
        {
            // Step 1: Check if the database exists for the given username
            bool userExists = CheckIfUserExists(username);

            if (!userExists)
            {
                // If the user does not exist, return a response to inform the frontend
                return Ok(new { userExists = false });
            }

            // Step 2: Check if the password matches the stored hash in the database
            string storedHashedPassword = GetStoredPasswordHash(username);
            bool passwordMatches = VerifyPassword(password, storedHashedPassword);

            if (!passwordMatches)
            {
                // If the password does not match, return a response to inform the frontend
                return Ok(new { passwordMatches = false });
            }

            // Step 3: If the username and password match, set the database path and return a success response

            // Get the correct database file path
            string dbFilePath = GetDatabaseFilePath(username);

            // Set the database path using DatabasePathManager
            DatabasePathManager.SetDatabasePath(dbFilePath);

            //Return Success
            return Ok(new { success = true, message = "Logged in successfully!" });
        }

        // POST: /api/createaccount
        // Endpoint to begin the Create Account process
        [HttpPost("/api/createaccount")]
        public IActionResult CreateAccount([FromQuery] string username, [FromQuery] string password)
        {
            try
            {
                // Step 1: Check if the user already exists
                bool userExists = CheckIfUserExists(username);

                if (userExists)
                {
                    // User already exists
                    return Ok(new { success = false, message = "User already exists!" });
                }

                // Step 2: Call helper function
                CreateAccountHelper(username, password);

                // Success message
                return Ok(new { success = true, message = "Account created successfully!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error creating account: " + ex.Message);
                return StatusCode(500, new { success = false, message = "An error occurred while creating the account." });
            }
        }

        // Helper method to check if the user exists in the database
        private bool CheckIfUserExists(string username)
        {
            // Set the database file path string
            string dbFilePath = GetDatabaseFilePath(username);

            // Use File.Exists to check if the database file exists
            if (!System.IO.File.Exists(dbFilePath))
            {
                // If the database doesn't exist, return false
                return false;
            }

            // Database exists, return true
            return true;
        }

        // Helper method to fetch the stored hashed password from the database
        private string GetStoredPasswordHash(string username)
        {
            // Set the database file path string
            string dbFilePath = GetDatabaseFilePath(username);

            // Set up SQL query string to select the password for the given username
            string selectQuery = "SELECT Password FROM User WHERE Username = @username;";

            // Define parameters for the SQL query, specifying the username parameter
            var parameters = new Dictionary<string, object>
            {
                // Bind the provided username to the @username parameter
                { "@username", username } 
            };

            // Perform the query to get the stored hash password
            using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
            {
                connection.Open();

                using (var command = new SQLiteCommand(selectQuery, connection))
                {
                    foreach (var parameter in parameters)
                    {
                        command.Parameters.AddWithValue(parameter.Key, parameter.Value);
                    }

                    // Execute the SQL command to retrieve the hashed password from the database and cast it to a string
                    var hashedPassword = command.ExecuteScalar() as string;

                    // Return hashed password
                    return hashedPassword!;
                }
            }
        }

        // Helper method to verify the password
        private static bool VerifyPassword(string password, string storedHashedPassword)
        {
            // Use BCrypt to verify if the entered password matches the stored hashed password
            return BCrypt.Net.BCrypt.Verify(password, storedHashedPassword);
        }

        // Helper method for creating a new account
        private void CreateAccountHelper(string username, string password)
        {
            // Call to create the database file path string
            string dbFilePath = GetDatabaseFilePath(username);

            // Set the database path using DatabasePathManager
            DatabasePathManager.SetDatabasePath(dbFilePath);

            // Call helper function to create the database and default tables
            CreateDatabaseAndTables(username);

            // Hash the password using Bcrypt and store it in the database
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

            // Perform the query to insert the user data into the User table
            using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
            {
                connection.Open();

                using (var command = new SQLiteCommand("INSERT OR REPLACE INTO User (Username, Password) VALUES (@username, @hashedPassword);", connection))
                {
                    // Bind parameters and execute the command
                    command.Parameters.AddWithValue("@username", username);
                    command.Parameters.AddWithValue("@hashedPassword", hashedPassword);

                    command.ExecuteNonQuery();
                }
            }
        }

        // Helper method for defining the database path
        private string GetDatabaseFilePath(string username)
        {
            // Create base directory string
            string baseDirectory = AppDomain.CurrentDomain.BaseDirectory;

            // Create the database folder string
            string dbFolder = Path.Combine(baseDirectory, "Databases");

            // If the database directory does not exists, create it
            Directory.CreateDirectory(dbFolder);

            // Create path to the specified database
            string dbFilePath = Path.Combine(dbFolder, $"{username}.db");

            return dbFilePath;
        }

        // Helper method to create the database and default tables
        private void CreateDatabaseAndTables(string username)
        {
            string dbFilePath = GetDatabaseFilePath(username);

            // Create the directory if it doesn't exist
            string dbDirectory = Path.GetDirectoryName(dbFilePath);
            Directory.CreateDirectory(dbDirectory);

            // SQLite will create the database file when the connection is opened
            using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
            {
                connection.Open();

                // Create user table
                using (var command = new SQLiteCommand("CREATE TABLE IF NOT EXISTS User (Username TEXT PRIMARY KEY, Password TEXT);", connection))
                {
                    command.ExecuteNonQuery();
                }

                // Create General_Journal table
                using (var command = new SQLiteCommand(
                    "CREATE TABLE IF NOT EXISTS General_Journal (" +
                    "ID INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "Date DATE," + 
                    "Account TEXT CHECK(length(Account) <= 255)," + // Use CHECK constraint to limit length
                    "Description TEXT CHECK(length(Description) <= 255)," + // Use CHECK constraint to limit length
                    "Debit REAL CHECK(Debit >= 0)," + // Use REAL data type for Debit and non-negative constraint
                    "Credit REAL CHECK(Credit >= 0));", // Use REAL data type for Credit and non-negative constraint
                    connection))
                {
                    command.ExecuteNonQuery();
                }

                // Create AccountsList table holding the name of the account and the name of the table
                using (var command = new SQLiteCommand(
                     "CREATE TABLE IF NOT EXISTS AccountsList (" +
                     "Entry INTEGER PRIMARY KEY AUTOINCREMENT," +
                     "Account_Name TEXT CHECK(length(Account_Name) <= 497)," + // Name of the account
                     "Table_Name TEXT);", // Name of the table: Account_<account name>
                     connection))
                {
                    command.ExecuteNonQuery();
                }

                // Create starter default account Income
                using (var command = new SQLiteCommand(
                    "CREATE TABLE IF NOT EXISTS Account_Income (" +
                    "Entry INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "Type INT," +
                    "Category INT," +
                    "Date DATE," +
                    "Description TEXT CHECK(length(Description) <= 255)," +
                    "Debit REAL CHECK(Debit >= 0)," +
                    "Credit REAL CHECK(Credit >= 0)," +
                    "Total REAL);",
                    connection))
                {
                    command.ExecuteNonQuery();
                }

                // Insert intial entry
                using (var command = new SQLiteCommand(
                    "INSERT INTO Account_Income (Type, Category, Date, Description, Debit, Credit, Total) " +
                    "VALUES (1, 1, DATE('now'), 'Account Created', 0, 0, 0);",
                     connection))
                {
                    command.ExecuteNonQuery();
                }

                // Add to AccountList
                using (var command = new SQLiteCommand(
                    "INSERT INTO AccountsList (Account_Name, Table_Name) VALUES ('Income', 'Account_Income');",
                    connection))
                {
                    command.ExecuteNonQuery();
                }

                // Create starter default account Cash
                using (var command = new SQLiteCommand(
                    "CREATE TABLE IF NOT EXISTS Account_Cash (" +
                    "Entry INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "Type INT," +
                    "Category INT," +
                    "Date DATE," +
                    "Description TEXT CHECK(length(Description) <= 255)," +
                    "Debit REAL CHECK(Debit >= 0)," +
                    "Credit REAL CHECK(Credit >= 0)," +
                    "Total REAL);",
                    connection))
                {
                    command.ExecuteNonQuery();
                }

                // Insert intial entry
                using (var command = new SQLiteCommand(
                    "INSERT INTO Account_Cash (Type, Category, Date, Description, Debit, Credit, Total) " +
                    "VALUES (2, 1, DATE('now'), 'Account Created', 0, 0, 0);",
                    connection))
                {
                    command.ExecuteNonQuery();
                }

                // Add to AccountList
                using (var command = new SQLiteCommand(
                    "INSERT INTO AccountsList (Account_Name, Table_Name) VALUES ('Cash', 'Account_Cash');",
                    connection))
                {
                    command.ExecuteNonQuery();
                }

                // Create starter default account Checking
                using (var command = new SQLiteCommand(
                    "CREATE TABLE IF NOT EXISTS Account_Checking (" +
                    "Entry INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "Type INT," +
                    "Category INT," +
                    "Date DATE," +
                    "Description TEXT CHECK(length(Description) <= 255)," +
                    "Debit REAL CHECK(Debit >= 0)," +
                    "Credit REAL CHECK(Credit >= 0)," +
                    "Total REAL);",
                    connection))
                {
                    command.ExecuteNonQuery();
                }

                // Insert intial entry
                using (var command = new SQLiteCommand(
                    "INSERT INTO Account_Checking (Type, Category, Date, Description, Debit, Credit, Total) " +
                    "VALUES (2, 1, DATE('now'), 'Account Created', 0, 0, 0);",
                    connection))
                {
                    command.ExecuteNonQuery();
                }

                // Add to AccountList
                using (var command = new SQLiteCommand(
                    "INSERT INTO AccountsList (Account_Name, Table_Name) VALUES ('Checking', 'Account_Checking');",
                    connection))
                {
                    command.ExecuteNonQuery();
                }

                // Create ToDoList table
                using (var command = new SQLiteCommand(
                    "CREATE TABLE IF NOT EXISTS ToDoList (" +
                    "ID INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "TitleDescription TEXT," +
                    "Date DATETIME," +
                    "Time TEXT," +
                    "Repeat INTEGER," +
                    "Notification BOOLEAN);",
                    connection))
                {
                    command.ExecuteNonQuery();
                }

                // Insert the first entry into ToDoList
                using (var command = new SQLiteCommand(
                    "INSERT INTO ToDoList (TitleDescription, Date, Time, Repeat, Notification) " +
                    "VALUES ('Please Create Tasks', DATETIME('now'), '0:00', 0, 0);",
                    connection))
                {
                    command.ExecuteNonQuery();
                }
            }
        }
    }
}