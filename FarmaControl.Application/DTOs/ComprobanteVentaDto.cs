namespace FarmaControl.Application.DTOs
{
    public class ComprobanteVentaDto
    {
        public int IdVenta { get; set; }

        public DateTime Fecha { get; set; }

        public decimal Total { get; set; }

        public List<ComprobanteDetalleDto> Detalle { get; set; } = new();
    }
}
