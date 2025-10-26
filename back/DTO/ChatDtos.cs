namespace MangoDB.Dtos
{
    public class ChatDto
    {
        public int ChatId { get; set; }
        public DateTime FechaCreacion { get; set; }

        // Una lista con los IDs de los usuarios que participan en el chat.
        public List<string> UsuarioIds { get; set; }

        // La lista de mensajes dentro del chat.
        public List<MensajeDto> Mensajes { get; set; }
    }
}
