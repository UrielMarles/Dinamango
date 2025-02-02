using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MangoDB.Models
{
    public class UserToken
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required, StringLength(255)]
        public string Token { get; set; }

        [Required]
        public DateTime Expiration { get; set; } = DateTime.UtcNow.AddDays(30); // Expira en 30 días

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}