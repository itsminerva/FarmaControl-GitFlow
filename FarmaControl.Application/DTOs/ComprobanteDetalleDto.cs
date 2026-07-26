namespace FarmaControl.Application.DTOs
{
    public class ComprobanteDetalleDto
    {
        public int IdProducto { get; set; }

        public string NombreProducto { get; set; } = string.Empty;

        public int Cantidad { get; set; }

        public decimal PrecioUnitario { get; set; }

        public decimal SubTotal { get; set; }
    }
}
