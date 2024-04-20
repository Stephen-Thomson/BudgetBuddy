using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;

namespace BudgetBuddyAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Create a new instance of WebApplicationBuilder to build the web application
            var builder = WebApplication.CreateBuilder(args);

            // Define a custom CORS policy name
            var MyCorsPolicy = "_myCorsPolicy";

            // Add controllers to the services collection
            builder.Services.AddControllers();

            // Configure CORS options
            builder.Services.AddCors(options =>
            {
                // Add a named CORS policy
                options.AddPolicy(name: MyCorsPolicy,
                policy =>
                {
                    // Allow requests from any origin
                    policy.AllowAnyOrigin()
                          // Allow wildcard subdomains
                          .SetIsOriginAllowedToAllowWildcardSubdomains()
                          // Allow any headers
                          .AllowAnyHeader()
                          // Allow any HTTP method
                          .AllowAnyMethod()
                          // Set origin validation to always return true
                          .SetIsOriginAllowed(origin =>
                          {
                              return true;
                          });
                });
            });

            //Configure Swagger for API documentation and testing
            builder.Services.AddSwaggerGen();

            // Build the web application
            var app = builder.Build();

            // Enable CORS using the specified policy
            app.UseCors(MyCorsPolicy);

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Your API V1");
            });

            // Enable HTTPS redirection
            app.UseHttpsRedirection();

            // Enable authorization
            app.UseAuthorization();

            // Map Controllers
            app.MapControllers();

            // Run the application
            app.Run();
        }
    }
}