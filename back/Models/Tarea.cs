using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MangoDB.Models
{
    public class Tarea
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required, MaxLength(255)]
        public string Titulo { get; set; }

        [Required]
        public string Descripcion { get; set; }

        [Required]
        public Guid IdCreador { get; set; }

        [Required, MaxLength(255)]
        public string Ubicacion { get; set; }

        public DateTime FechaPublicacion { get; set; } = DateTime.UtcNow;

        [Required, MaxLength(50)]
        public string HorarioDeseado { get; set; }

        [Required, MaxLength(50)]
        public string FechaDeseada { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal DineroOfrecido { get; set; }

        [ForeignKey("IdCreador")]
        public User Creador { get; set; }
    }

}
