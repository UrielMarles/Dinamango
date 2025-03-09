
using MangoDB.Context;
using MangoDB.Services;
using Microsoft.EntityFrameworkCore;

namespace MangoDB
{
    public class Program
    {
        public static IConfiguration? Configuration { get; set; }

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Cargar configuración desde appsettings.json
            builder.Configuration.AddJsonFile("Properties/appsettings.json", optional: true, reloadOnChange: true);

            // Agregar servicios al contenedor
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Agregar DbContext con SQL Server
            builder.Services.AddDbContext<MangoDBcontext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Inyectar UserService
            builder.Services.AddScoped<UserService>();

            // Habilitar CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                   policy =>
                   {
                       policy.WithOrigins("http://localhost:3000") // Cambia esto por la URL de tu frontend
                             .AllowAnyMethod()
                             .AllowAnyHeader();
                   });
            });

            var app = builder.Build();
            Configuration = app.Configuration;

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("AllowFrontend");
            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
