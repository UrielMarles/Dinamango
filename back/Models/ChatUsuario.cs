using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MangoDB.Models
{
    public class ChatUsuario
    {
        //[Key]
        //[Column("Id")]
        public int ChatId { get; set; }

        [Required]
        public Chat Chat { get; set; }

        [Required]
        public Guid UsuarioId { get; set; }

        [Required]
        public User Usuario { get; set; }
    }

}
