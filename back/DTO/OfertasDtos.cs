namespace MangoDB.DTO
{
    public class CreateOfertaDTO
    {
        public string MensajeOferta { get; set; }
    }
    public class OfertaDTO
    {
        public Guid Id { get; set; }
        public string MensajeOferta { get; set; }
        public DateTime FechaCreacion { get; set; }
        public ResultGetUsuarioDTO Creador { get; set; }
        //public string Status { get; set; }
    }
}
