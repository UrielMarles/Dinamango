using MangoDB.Models;
using Microsoft.EntityFrameworkCore;

namespace MangoDB.Context
{
    public class MangoDBcontext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<UserToken> UserTokens { get; set; }
        public DbSet<Tarea> Tareas { get; set; }
        public DbSet<Oferta> Ofertas { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<ChatUsuario> ChatUsuarios { get; set; }
        public DbSet<Mensaje> Mensajes { get; set; }

        public MangoDBcontext(DbContextOptions<MangoDBcontext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasMany(u => u.UserTokens)
                .WithOne(t => t.User)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Tareas)
                .WithOne(t => t.Creador)
                .HasForeignKey(t => t.IdCreador)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Tarea>()
                .HasMany(t => t.Ofertas)
                .WithOne(o => o.Tarea)
                .HasForeignKey(o => o.IdTarea)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ChatUsuario>()
                .HasKey(cu => new { cu.ChatId, cu.UsuarioId });

            modelBuilder.Entity<ChatUsuario>()
                .HasOne(cu => cu.Usuario)
                .WithMany(u => u.ChatUsuarios)
                .HasForeignKey(cu => cu.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ChatUsuario>()
                .HasOne(cu => cu.Chat)
                .WithMany(c => c.ChatUsuarios)
                .HasForeignKey(cu => cu.ChatId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Mensaje>()
                .HasOne(m => m.Chat)
                .WithMany(c => c.Mensajes)
                .HasForeignKey(m => m.ChatId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Mensaje>()
                .HasOne(m => m.Remitente)
                .WithMany(u => u.MensajesEnviados)
                .HasForeignKey(m => m.RemitenteId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }

}
