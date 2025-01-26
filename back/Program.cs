using System.Globalization;
using Microsoft.EntityFrameworkCore;
using ServerSuly.Data;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Configurar la cultura predeterminada como invariante
        CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;
        CultureInfo.DefaultThreadCurrentUICulture = CultureInfo.InvariantCulture;


        // Agregar servicios al contenedor
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        // Registrar el contexto de base de datos con logs detallados
        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(
                builder.Configuration.GetConnectionString("DefaultConnection"),
                sqlOptions => sqlOptions.EnableRetryOnFailure() // Habilitar reintentos en caso de fallo
            )
            .EnableSensitiveDataLogging() // Mostrar datos sensibles en los logs para depuración
            .LogTo(Console.WriteLine));   // Log de operaciones de EF Core en la consola

        var app = builder.Build();

        // Configuración para entorno de desarrollo
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();

        // Mapear controladores
        app.MapControllers();

        // Ejecutar la aplicación
        app.Run();
    }
}
