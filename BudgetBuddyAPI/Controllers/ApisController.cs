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
        // Define class to hold task data
        public class TaskModel
        {
            public int ID { get; set; }
            public string TitleDescription { get; set; }
            public DateTime Date { get; set; }
            public string Time { get; set; }
            public int Repeat { get; set; }
            public bool Notification { get; set; }
        }

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

        // GET: /api/checkTasks
        [HttpGet("/api/checkTasks")]
        public IActionResult CheckTasks()
        {
            int firstTrue = 0;
            Console.WriteLine("CheckTasks called");
            try
            {
                string dbFilePath = DatabasePathManager.GetDatabasePath();

                if (string.IsNullOrEmpty(dbFilePath))
                {
                    return BadRequest("Database path is not initialized.");
                }

                List<string> notificationList = new List<string>();

                // Connect to the SQLite database
                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();

                    // Query to retrieve task data from the ToDoList table
                    using (var command = new SQLiteCommand("SELECT * FROM ToDoList", connection))
                    {
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var taskModel = new TaskModel
                                {
                                    ID = reader.GetInt32(0),
                                    TitleDescription = reader.GetString(1),
                                    Date = reader.GetDateTime(2),
                                    Time = reader.GetString(3),
                                    Repeat = reader.GetInt32(4),
                                    Notification = reader.GetBoolean(5)
                                };

                                if (taskModel.Notification)
                                {
                                    if (IsTaskDue(taskModel))
                                    {
                                        if (firstTrue == 0)
                                        {
                                            string dueLine = "These tasks are currently due!";
                                            notificationList.Add(dueLine);
                                            firstTrue = 1;
                                        }
                                        Console.WriteLine("Due True");

                                        // Add the notification string to the list
                                        notificationList.Add(taskModel.TitleDescription);
                                    }
                                }
                            }
                        }
                    }
                }

                if (notificationList.Any())
                {
                    Console.WriteLine("Notification List:");
                    foreach (var notification in notificationList)
                    {
                        Console.WriteLine(notification); // Assuming notification is a string
                    }
                    return Ok(notificationList);
                }
                else
                {
                    // Return an empty list when no notifications are found
                    return Ok(new List<string>());
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions here
                return BadRequest($"An error occurred: {ex.Message}");
            }
        }

        private bool IsTaskDue(TaskModel taskModel)
        {
            // Get current DateTime in UTC to avoid time zone issues
            var currentDateTime = DateTime.Now;
            Console.WriteLine($"Current DateTime (Local): {currentDateTime}");

            // Split the time string into hours and minutes
            string[] timeParts = taskModel.Time.Split(':');

            // Parse hours and minutes into integers
            int hours = int.Parse(timeParts[0]);
            int minutes = int.Parse(timeParts[1]);

            // Create a TimeSpan object
            TimeSpan taskTime = new TimeSpan(hours, minutes, 0); // Assuming seconds are always 0
            Console.WriteLine($"Task Time: {taskTime}");

            // Combine the task date and extracted time to create a new DateTime
            var taskDateTime = new DateTime(taskModel.Date.Year, taskModel.Date.Month, taskModel.Date.Day,
                                            taskTime.Hours, taskTime.Minutes, taskTime.Seconds, DateTimeKind.Unspecified);
            Console.WriteLine($"Task DateTime (Local): {taskDateTime}");

            // Calculate time difference
            var timeDifference = currentDateTime - taskDateTime;
            Console.WriteLine($"Time Difference: {timeDifference}");

            // Check if the task's date is today and the time is within the last 2 minutes
            if (currentDateTime.Date == taskDateTime.Date)
            {
                var isWithinLast2Minutes = timeDifference >= TimeSpan.Zero && timeDifference <= TimeSpan.FromMinutes(2);
                Console.WriteLine($"Is Task Within Last 2 Minutes: {isWithinLast2Minutes}");
                return isWithinLast2Minutes;
            }
            // Check if the task's date is in the past and its time is within 2 minutes
            else if (taskDateTime.Date < currentDateTime.Date)
            {
                // Calculate the time difference from the end of the current day to the task's time
                var endOfDayDifference = TimeSpan.FromHours(24) - taskTime;
                Console.WriteLine($"End of Day Difference: {endOfDayDifference}");

                // Check if the time difference is within 2 minutes of the end of the day
                var isWithinLast2Minutes = endOfDayDifference <= TimeSpan.FromMinutes(2);
                Console.WriteLine($"Is Task Within Last 2 Minutes of End of Day: {isWithinLast2Minutes}");
                return isWithinLast2Minutes;
            }

            return false;
        }

        // POST: /api/updateRepeat
        [HttpPost("/api/updateRepeat")]
        public IActionResult UpdateRepeat()
        {
            try
            {
                string dbFilePath = DatabasePathManager.GetDatabasePath();

                if (string.IsNullOrEmpty(dbFilePath))
                {
                    return BadRequest("Database path is not initialized.");
                }

                // Connect to the SQLite database
                using (var connection = new SQLiteConnection($"Data Source={dbFilePath};Version=3;"))
                {
                    connection.Open();

                    // Query to retrieve task data from the ToDoList table
                    using (var command = new SQLiteCommand("SELECT * FROM ToDoList", connection))
                    {
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var taskModel = new TaskModel
                                {
                                    ID = reader.GetInt32(0),
                                    TitleDescription = reader.GetString(1),
                                    Date = reader.GetDateTime(2),
                                    Time = reader.GetString(3),
                                    Repeat = reader.GetInt32(4),
                                    Notification = reader.GetBoolean(5)
                                };

                                if (IsTaskDue(taskModel))
                                {
                                    DateTime newDate;

                                    // Determine the new date based on the Repeat value
                                    switch (taskModel.Repeat)
                                    {
                                        case 1: // Daily repeat
                                            newDate = taskModel.Date.AddDays(1);
                                            break;
                                        case 2: // Weekly repeat
                                            newDate = taskModel.Date.AddDays(7);
                                            break;
                                        case 3: // Monthly repeat
                                            newDate = taskModel.Date.AddMonths(1);
                                            break;
                                        default: // No repeat or unknown value
                                                 // No change to the date
                                            newDate = taskModel.Date;
                                            break;
                                    }

                                    // Use SQL UPDATE statement to update the ToDoList table
                                    using (var updateCommand = new SQLiteCommand("UPDATE ToDoList SET Date = @NewDate WHERE ID = @TaskID", connection))
                                    {
                                        updateCommand.Parameters.AddWithValue("@NewDate", newDate);
                                        updateCommand.Parameters.AddWithValue("@TaskID", taskModel.ID);
                                        updateCommand.ExecuteNonQuery();
                                    }
                                }
                            }
                        }
                    }
                }

                return Ok("Repeat updated successfully");
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while updating repeat: {ex.Message}");
            }
        }





    }
}
