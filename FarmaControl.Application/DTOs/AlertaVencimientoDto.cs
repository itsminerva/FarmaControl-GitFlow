namespace FarmaControl.Application.DTOs
{
    public class AlertaVencimientoDto
    {
        public int IdProducto { get; set; }

        public string Codigo { get; set; } = string.Empty;

        public string NombreProducto { get; set; } = string.Empty;

        public DateTime FechaVencimiento { get; set; }

        public int DiasParaVencer { get; set; }

        public int Stock { get; set; }
    }
}
