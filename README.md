# Budget Buddy
### What is it?
Budget Buddy is a simple accounting program that allows users to keep and track
their household expenses, income, and assets. It is a slimmed down version of 
other accounting programs to increase ease of use for common users.
It also includes a simple To Do List function in which users can create and edit
tasks with a description, date and time for a deadline, repeat daily, weekly, or
monthly, and let the app know whether or not they wish to recieve notifications.

### Devloper
- [Stephen Thomson] (https://github.com/Stephen-Thomson)

### Features
- General Journal - Double Post accounting
- Totals Report
- Current Budget Report
- Adjustable Budget Report
- To Do List

# Setup and Deploy

## Setup

### Prerequisites

#### Backend (ASP.NET C#)
- .NET 6
- BudgetBuddyAPI folder containing backend code

#### Frontend (React)
- Node.js
- npm
- frontend_react folder containing frontend code

### Run for Testing

#### Backend
1. Navigate to the BudgetBuddyAPI folder.
2. Run the backend program using .NET 6
   ```bash
   dotnet run

#### Frontend
1. Navigate to the frontend_react folder.
2. Run the Development server
   ```bash
   npm run dev

### Build

#### Backend (ASP.NET C#)
To build the backend for deployment:
1. Navigate to the BudgetBuddyAPI folder.
2. Build the project using the following command
   ```bash
   dotnet build --configuration Release

#### Frontend (React)
To build the frontend for deployment:
1. Navigate to the frontend_react folder.
2. Build the project using the following command:
   ```bash
   npm run build

### Deploy
After building both the backend and frontend, you can deploy the Budget Buddy application to your desired platform or server.
