using Microsoft.EntityFrameworkCore;
using NorthwindBackend.Models;
var builder = WebApplication.CreateBuilder(args);

//services
builder.Services.AddControllers();
builder.Services.AddDbContext<NorthwindContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("NorthwindConnection")));

var app = builder.Build();

//middleware
app.MapControllers();

app.Run();
