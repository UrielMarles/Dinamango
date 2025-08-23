namespace MangoDB.DTO
{
    public class ParamsCreateTareasDTO
    {
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public string Ubicacion { get; set; }
        public string HorarioDeseado { get; set; }
        public string FechaDeseada { get; set; }
        public decimal DineroOfrecido { get; set; }
    }
    public class ParamsGetTareasDTO
    {
        public decimal? MinDinero { get; set; }
        public decimal? MaxDinero { get; set; }
        public int? Cantidad { get; set; }
    }
    public class ResultTareaConOfertasDTO
    {
        public Guid Id { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public string Ubicacion { get; set; }
        public string HorarioDeseado { get; set; }
        public string FechaDeseada { get; set; }
        public decimal DineroOfrecido { get; set; }
        public DateTime FechaPublicacion { get; set; }
        public ResultGetUsuarioDTO Creador { get; set; }
        public List<OfertaDTO> Ofertas { get; set; }
    }
}

