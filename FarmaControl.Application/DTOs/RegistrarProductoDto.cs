namespace FarmaControl.Application.DTOs
{
    public class RegistrarProductoDto
    {
        public string? Codigo { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public int? IdCategoria { get; set; }

        public int IdProveedor { get; set; }

        public decimal? PrecioCompra { get; set; }

        public decimal? PrecioVenta { get; set; }

        public decimal? Precio { get; set; }

        public int? Stock { get; set; }

        public int? CantidadDisponible { get; set; }

        public int? StockMinimo { get; set; }

        public DateTime FechaVencimiento { get; set; }
    }
}
