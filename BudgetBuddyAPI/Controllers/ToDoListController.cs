using Microsoft.AspNetCore.Mvc;
using System.Data.SQLite;

namespace BudgetBuddyAPI.Controllers
{
    [ApiController]
    public class ToDoListController : ControllerBase
    {
        // Define class to hold task data
        public class Task
        {
            public int ID { get; set; }
            public string TitleDescription { get; set; }
            public DateTime Date { get; set; }
            public string Time { get; set; }
            public int Repeat { get; set; }
            public bool Notification { get; set; }
        }

        // Define the class to hold the request data for creating a task
        public class CreateTaskRequest
        {
            public string TitleDescription { get; set; }
            public DateTime Date { get; set; }
            public string Time { get; set; }
            public int Repeat { get; set; }
            public bool Notification { get; set; }
        }

        // GET: /api/getTasks
        // Retreives all tasks in the database
        [HttpGet("/api/getTasks")]
        public JsonResult GetTasks()
        {
            try
            {
                // Get database path
                string dbFilePath = DatabasePathManager.GetDatabasePath();

                // Connect to the SQLite database
                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();

                    // Query to select tasks from the database
                    var query = "SELECT ID, TitleDescription, Date, Time, Repeat, Notification FROM ToDoList";

                    using (var command = new SQLiteCommand(query, connection))
                    {
                        using (var reader = command.ExecuteReader())
                        {
                            // Create a list to hold tasks
                            var tasks = new List<Task>();

                            // Read in tasks
                            while (reader.Read())
                            {
                                var task = new Task
                                {
                                    ID = reader.GetInt32(0),
                                    TitleDescription = reader.GetString(1),
                                    Date = reader.GetDateTime(2),
                                    Time = reader.GetString(3),
                                    Repeat = reader.GetInt32(4),
                                    Notification = reader.GetBoolean(5)
                                };
                                // Add task to list
                                tasks.Add(task);
                            }

                            // If no tasks were found, return a default task
                            if (tasks.Count > 1) 
                            {
                                tasks.RemoveAt(0);
                            }

                            // Create response
                            var responseData = new
                            {
                                tasks
                            };

                            return new JsonResult(Ok(responseData));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Error code
                Console.Error.WriteLine($"GetTasks error: {ex.Message}");

                return new JsonResult(new { success = false, message = "Internal server error." });
            }
        }

        // POST: /api/createTask
        // Inserts a new task into the database
        [HttpPost("/api/createTask")]
        public IActionResult CreateTask([FromBody] CreateTaskRequest taskData)
        {
            try
            {
                // Get database path
                string dbFilePath = DatabasePathManager.GetDatabasePath();

                // Connect to the SQLite database 
                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();

                    // SQL Query command for insertion
                    var query = "INSERT INTO ToDoList (TitleDescription, Date, Time, Repeat, Notification) VALUES (@TitleDescription, @Date, @Time, @Repeat, @Notification);";

                    // Parameterize values
                    using (var command = new SQLiteCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@TitleDescription", taskData.TitleDescription);
                        command.Parameters.AddWithValue("@Date", taskData.Date);
                        command.Parameters.AddWithValue("@Time", taskData.Time);
                        command.Parameters.AddWithValue("@Repeat", taskData.Repeat);
                        command.Parameters.AddWithValue("@Notification", taskData.Notification);

                        command.ExecuteNonQuery();
                    }
                }

                return Ok(new { success = true, message = "Task posted successfully." });
            }
            catch (Exception ex)
            {
                // Error code
                Console.WriteLine($"Error creating task: {ex.Message}");

                return StatusCode(500, "Internal server error.");
            }
        }

        // POST: /api/updateTask
        // Updates a task in the database from the given data
        [HttpPost("/api/updateTask")]
        public IActionResult UpdateTask([FromBody] Task taskData)
        {
            try
            {
                // Get database path
                string dbFilePath = DatabasePathManager.GetDatabasePath();

                // Connect to the SQLite database
                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();

                    // SQL Query command to update table
                    var query = "UPDATE ToDoList SET TitleDescription = @TitleDescription, Date = @Date, Time = @Time, Repeat = @Repeat, Notification = @Notification WHERE ID = @ID";
                    
                    // Parameterize values
                    using (var command = new SQLiteCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@TitleDescription", taskData.TitleDescription);
                        command.Parameters.AddWithValue("@Date", taskData.Date);
                        command.Parameters.AddWithValue("@Time", taskData.Time);
                        command.Parameters.AddWithValue("@Repeat", taskData.Repeat);
                        command.Parameters.AddWithValue("@ID", taskData.ID);
                        command.Parameters.AddWithValue("@Notification", taskData.Notification);

                        command.ExecuteNonQuery();
                    }
                }

                return Ok(new { success = true, message = "Task posted successfully." });
            }
            catch (Exception ex)
            {
                // Error code
                Console.WriteLine($"Error creating task: {ex.Message}");

                return StatusCode(500, "Internal server error.");
            }
        }

        // GET: /api/getTask
        // Retrieve indicated task by it's ID
        [HttpGet("/api/getTask")]
        public JsonResult GetTask([FromQuery] int taskId)
        {
            try
            {
                // Get database path
                string dbFilePath = DatabasePathManager.GetDatabasePath();

                // Connect to the SQLite database
                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();

                    // SQl query to retrieve task
                    var query = "SELECT ID, TitleDescription, Date, Time, Repeat, Notification FROM ToDoList WHERE ID = @taskId";

                    // Get task data
                    using (var command = new SQLiteCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@taskId", taskId);
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                // Read in task
                                var retrievedTask = new Task
                                {
                                    ID = reader.GetInt32(0),
                                    TitleDescription = reader.GetString(1),
                                    Date = reader.GetDateTime(2),
                                    Time = reader.GetString(3),
                                    Repeat = reader.GetInt32(4),
                                    Notification = reader.GetBoolean(5)
                                };

                                // Create a response object
                                var responseData = new
                                {
                                    retrievedTask
                                };

                                // Return the response
                                return new JsonResult(Ok(responseData));
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Error code
                Console.Error.WriteLine($"GetTask error: {ex.ToString()}");

                // Return an error response
                return new JsonResult(new { success = false, message = "Internal server error." });
            }

            // If no task is found, return a not found response
            return new JsonResult(new { success = false, message = "Task not found." });
        }

        // POST: /api/deleteTasks
        // Deletes the indicated tasks from the database
        [HttpPost("/api/deleteTasks")]
        public IActionResult DeleteTasks(int[] taskIds)
        {
            try
            {
                // Get database path
                string dbFilePath = DatabasePathManager.GetDatabasePath();

                // Connect to the SQLite database
                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();

                    // Iterate through all task ids
                    foreach (int taskId in taskIds)
                    {
                        // SQL Query command to delete task with the given ID
                        var query = $"DELETE FROM ToDoList WHERE ID = @taskId";
                        using (var command = new SQLiteCommand(query, connection))
                        {
                            command.Parameters.AddWithValue("@taskId", taskId);
                            command.ExecuteNonQuery();
                        }
                    }
                }

                return Ok(new { success = true, message = "Tasks deleted successfully." });
            }
            catch (Exception ex)
            {
                // Error code
                Console.WriteLine($"Error deleting tasks: {ex.Message}");

                // Return error response
                return StatusCode(500, "Internal server error.");
            }
        }

    }
}