using System.ComponentModel.DataAnnotations;

namespace MangoDB.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required]
        public string Salt { get; set; } // Nuevo campo para almacenar el salt

        [Required]
        public string FullName { get; set; }

        [Required]
        public string Role { get; set; } = "User";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public List<UserToken> UserTokens { get; set; } = new List<UserToken>();
        public List<Tarea> Tareas { get; set; } = new List<Tarea>();
    }

}