using ToDoApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// add cors configuration
builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowSpecificOrigin",
    builder =>
    {
      builder.WithOrigins("*")
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

builder.Services.AddScoped<TodoService>(serviceProvider =>
{
  var configuration = serviceProvider.GetRequiredService<IConfiguration>();
  var connectionString = configuration.GetConnectionString("DefaultConnection");
  return new TodoService(connectionString);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.UseCors();

app.Run();
