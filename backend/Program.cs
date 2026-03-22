using Microsoft.EntityFrameworkCore;
using CloudBackend.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Dodaj kontrolery
builder.Services.AddControllers();

// 2. Pobierz Connection String z Docker Compose
var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") 
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

// 3. Konfiguracja bazy danych (SQL Server)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 4. CORS - ważne dla połączenia React -> .NET
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// --- KLUCZOWY MOMENT: AUTOMATYCZNE TWORZENIE BAZY ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        // To polecenie stworzy bazę i tabele, jeśli ich nie ma w SQL Edge
        context.Database.EnsureCreated();
        Console.WriteLine(">>> Baza danych CloudAppDb została sprawdzona/stworzona pomyślnie.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($">>> BŁĄD PODCZAS TWORZENIA BAZY: {ex.Message}");
    }
}
// ----------------------------------------------------

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(); // To pozwala Frontendowi "gadać" z Backendem
app.UseAuthorization();
app.MapControllers();
app.Run();