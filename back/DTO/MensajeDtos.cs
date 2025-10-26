using System.ComponentModel.DataAnnotations;

namespace MangoDB.Dtos
{
    public class MensajeDto
    {
        public int Id { get; set; }

        [Required]
        public int ChatId { get; set; }

        [Required]
        public Guid RemitenteId { get; set; }

        [Required]
        public string Contenido { get; set; }

        public DateTime FechaEnvio { get; set; } = DateTime.UtcNow;

        public bool Leido { get; set; } = false;
    }
}
