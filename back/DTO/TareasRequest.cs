namespace MangoDB.DTO
{
    public class TareaDTO
    {
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public string Ubicacion { get; set; }
        public string HorarioDeseado { get; set; }
        public string FechaDeseada { get; set; }
        public decimal DineroOfrecido { get; set; }
    }
    public class GetTareasDTO
    {
        public decimal? MinDinero { get; set; }
        public decimal? MaxDinero { get; set; }
        public int? Cantidad { get; set; }
    }
}
