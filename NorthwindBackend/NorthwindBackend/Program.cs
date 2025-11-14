var builder = WebApplication.CreateBuilder(args);

//services
builder.Services.AddControllers();

var app = builder.Build();

//middleware
app.MapControllers();

app.Run();
