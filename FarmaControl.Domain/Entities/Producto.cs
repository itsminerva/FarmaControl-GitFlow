using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaControl.Domain.Entities
{
    public class Producto
    {
        public int IdProducto { get; set; }

        public string Codigo { get; set; } = string.Empty;

        public string Nombre { get; set; } = string.Empty;

        public int IdCategoria { get; set; }

        public int IdProveedor { get; set; }

        public decimal PrecioCompra { get; set; }

        public decimal PrecioVenta { get; set; }

        public int Stock { get; set; }

        public int StockMinimo { get; set; }

        public DateTime FechaVencimiento { get; set; }

        public bool Activo { get; set; }

        [ForeignKey(nameof(IdCategoria))]
        public Categoria? Categoria { get; set; }

        [ForeignKey(nameof(IdProveedor))]
        public Proveedor? Proveedor { get; set; }
    }
}