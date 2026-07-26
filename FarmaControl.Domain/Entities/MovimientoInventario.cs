namespace FarmaControl.Domain.Entities
{
    public class MovimientoInventario
    {
        public int IdMovimiento { get; set; }

        public int IdProducto { get; set; }

        public string TipoMovimiento { get; set; } = string.Empty;

        public int Cantidad { get; set; }

        public DateTime Fecha { get; set; }

        public string? Observacion { get; set; }

        public Producto? Producto { get; set; }
    }
}