var builder = WebApplication.CreateBuilder(args);

//services

var app = builder.Build();


//middleware

app.MapGet("/", () => "Hello World!");

app.Run();
