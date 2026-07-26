namespace FarmaControl.Domain.Entities
{
    public class Venta
{
        public int IdVenta { get; set; }

        public DateTime Fecha { get; set; }

        public decimal Total { get; set; }

        public ICollection<DetalleVenta> DetalleVentas { get; set; } = new List<DetalleVenta>();
    }
}