using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MangoDB.Models
{
    public class Oferta
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid IdTarea { get; set; }

        [Required]
        public Guid IdCreadorOferta { get; set; }

        [Required]
        public string MensajeOferta { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        [ForeignKey("IdTarea")]
        public Tarea Tarea { get; set; }

        [ForeignKey("IdCreadorOferta")]
        public User CreadorOferta { get; set; }
    }

}
