using Microsoft.EntityFrameworkCore;
using ServerSuly.Models;

namespace ServerSuly.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Ejemplo> Ejemplos { get; set; }
    }
}
