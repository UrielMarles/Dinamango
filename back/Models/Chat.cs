using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MangoDB.Models
{
    public class Chat
    {
        [Key]
        public int Id { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        [Required]
        public ICollection<ChatUsuario> ChatUsuarios { get; set; }

        [Required]
        public ICollection<Mensaje> Mensajes { get; set; }
    }

}
