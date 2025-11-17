using Microsoft.EntityFrameworkCore;
using NorthwindBackend.Models;

var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy  =>
                      {
                          policy.WithOrigins("http://localhost:5173")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

//services
builder.Services.AddControllers();
builder.Services.AddDbContext<NorthwindContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("NorthwindConnection")));
builder.Services.AddAutoMapper(typeof(Program));
var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);

//middleware
app.MapControllers();


app.Run();
