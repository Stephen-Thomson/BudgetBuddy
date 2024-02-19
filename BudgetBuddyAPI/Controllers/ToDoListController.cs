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
using static BudgetBuddyAPI.Controllers.ToDoListController;

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


        [HttpGet("/api/getTasks")]
        public JsonResult GetTasks()
        {
            try
            {
                Console.WriteLine($"Database Path test: {DatabasePathManager.GetDatabasePath()}");
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                Console.WriteLine($"Database Path test: {dbFilePath}");


                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    Console.WriteLine("Connection Open");

                    // Query to select tasks from the database
                    var query = "SELECT ID, TitleDescription, Date, Time, Repeat, Notification FROM ToDoList";

                    using (var command = new SQLiteCommand(query, connection))
                    {
                        using (var reader = command.ExecuteReader())
                        {
                            var tasks = new List<Task>();
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
                                tasks.Add(task);
                            }

                            if (tasks.Count > 1) // If no tasks were found, return a default task
                            {
                                tasks.RemoveAt(0);
                            }

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
                Console.Error.WriteLine($"GetTasks error: {ex.Message}");

                return new JsonResult(new { success = false, message = "Internal server error." });
            }
        }

        [HttpPost("/api/createTask")]
        public IActionResult CreateTask([FromBody] CreateTaskRequest taskData)
        {
            try
            {
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                Console.WriteLine($"Database Path: {dbFilePath}");

                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    Console.WriteLine("Connection Open");

                    // SQL Query command
                    var query = "INSERT INTO ToDoList (TitleDescription, Date, Time, Repeat, Notification) VALUES (@TitleDescription, @Date, @Time, @Repeat, @Notification);";

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
                // Log the error
                Console.WriteLine($"Error creating task: {ex.Message}");

                // Return error response
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("/api/updateTask")]
        public IActionResult UpdateTask([FromBody] Task taskData)
        {
            try
            {
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                Console.WriteLine($"Database Path: {dbFilePath}");

                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    Console.WriteLine("Connection Open");

                    // SQL Query command
                    var query = "UPDATE ToDoList SET TitleDescription = @TitleDescription, Date = @Date, Time = @Time, Repeat = @Repeat, Notification = @Notification WHERE ID = @ID";
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
                // Log the error
                Console.WriteLine($"Error creating task: {ex.Message}");

                // Return error response
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("/api/getTask")]
        public JsonResult GetTask([FromQuery] int taskId)
        {
            try
            {
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                Console.WriteLine($"Database Path: {dbFilePath}");

                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    Console.WriteLine("Connection Open");

                    var query = "SELECT ID, TitleDescription, Date, Time, Repeat, Notification FROM ToDoList WHERE ID = @taskId";
                    using (var command = new SQLiteCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@taskId", taskId);
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
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

                                // Print the JSON response to the console
                                Console.WriteLine("JSON Response:");
                                Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(retrievedTask, new System.Text.Json.JsonSerializerOptions { WriteIndented = true }));

                                // Return the response
                                return new JsonResult(Ok(responseData));
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the detailed error information
                Console.Error.WriteLine($"GetTask error: {ex.ToString()}");

                // Return an error response
                return new JsonResult(new { success = false, message = "Internal server error." });
            }

            // If no task is found, return a not found response
            Console.WriteLine("Task Not Found");
            return new JsonResult(new { success = false, message = "Task not found." });
        }

        [HttpPost("/api/deleteTasks")]
        public IActionResult DeleteTasks(int[] taskIds)
        {
            try
            {
                string dbFilePath = DatabasePathManager.GetDatabasePath();
                Console.WriteLine($"Database Path: {dbFilePath}");

                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();
                    Console.WriteLine("Connection Open");

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
                // Log the error
                Console.WriteLine($"Error deleting tasks: {ex.Message}");

                // Return error response
                return StatusCode(500, "Internal server error.");
            }
        }





    }
}