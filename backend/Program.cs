using Azure.Identity;
using CloudBackend.Data;
using CloudBackend.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ------------------------------------------------------------
// INTEGRACJA Z AZURE KEY VAULT
// ------------------------------------------------------------
// Jeśli aplikacja działa w środowisku produkcyjnym (Azure),
// sekrety są pobierane z Azure Key Vault przy użyciu
// Managed Identity (bez haseł w kodzie)
if (builder.Environment.IsProduction())
{
    var vaultName = builder.Configuration["KeyVaultName"];

    if (!string.IsNullOrEmpty(vaultName))
    {
        var keyVaultEndpoint = new Uri($"https://{vaultName}.vault.azure.net/");
        builder.Configuration.AddAzureKeyVault(
            keyVaultEndpoint,
            new DefaultAzureCredential()
        );
    }
}

// ------------------------------------------------------------
// SERVICES (Dependency Injection)
// ------------------------------------------------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Pobranie Connection String
// W Azure zostanie on automatycznie pobrany z Key Vault
var connectionString =
    builder.Configuration["DbConnectionString"]
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

// Rejestracja DbContext z mechanizmem Retry
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        connectionString,
        sqlOptions => sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null
        )
    )
);

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

// ------------------------------------------------------------
// AUTOMATYCZNE DANE STARTOWE
// ------------------------------------------------------------
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    try
    {
        var context = services.GetRequiredService<AppDbContext>();

        if (!context.Tasks.Any())
        {
            context.Tasks.AddRange(
                new CloudTask
                {
                    Name = "Zrobić kawę",
                    IsCompleted = true
                },
                new CloudTask
                {
                    Name = "Zabezpieczyć aplikację w Azure",
                    IsCompleted = true
                }
            );

            context.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Błąd bazy: {ex.Message}");
    }
}

// ------------------------------------------------------------
// MIDDLEWARE
// ------------------------------------------------------------
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Cloud API V1");
    c.RoutePrefix = string.Empty;
});

app.UseCors();
app.MapControllers();
app.Run();