namespace MangoDB.Models
{
    public class Mensaje
    {
        public int Id { get; set; }
        public int ChatId { get; set; }
        public Chat Chat { get; set; }
        public Guid RemitenteId { get; set; }
        public User Remitente { get; set; }
        public string Contenido { get; set; }
        public DateTime FechaEnvio { get; set; } = DateTime.UtcNow;
        public bool Leido { get; set; } = false;
    }

}
