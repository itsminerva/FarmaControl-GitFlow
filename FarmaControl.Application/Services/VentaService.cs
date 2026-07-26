using FarmaControl.Application.DTOs;
using FarmaControl.Application.Interfaces;
using FarmaControl.Domain.Entities;

namespace FarmaControl.Application.Services
{
    public class VentaService : IVentaService
    {
        private readonly IVentaRepository _ventaRepository;
        private readonly IProductoRepository _productoRepository;

        public VentaService(IVentaRepository ventaRepository, IProductoRepository productoRepository)
        {
            _ventaRepository = ventaRepository;
            _productoRepository = productoRepository;
        }

        public async Task<List<ComprobanteVentaDto>> ObtenerTodasAsync()
        {
            var ventas = await _ventaRepository.ObtenerTodasAsync();

            return ventas.Select(ConstruirComprobante).ToList();
        }

        public async Task<ComprobanteVentaDto> RegistrarVentaAsync(RegistrarVentaDto ventaDto)
        {
            if (ventaDto.Productos == null || ventaDto.Productos.Count == 0)
                throw new InvalidOperationException("Debe seleccionar al menos un producto para registrar la venta.");

            var venta = new Venta
            {
                Fecha = DateTime.Now
            };

            var productosVendidos = new Dictionary<int, Producto>();
            decimal total = 0;

            foreach (var item in ventaDto.Productos)
            {
                if (item.Cantidad <= 0)
                    throw new InvalidOperationException("La cantidad de cada producto debe ser mayor a cero.");

                var producto = await _productoRepository.ObtenerPorIdAsync(item.IdProducto);

                if (producto == null)
                    throw new InvalidOperationException($"El producto con ID {item.IdProducto} no existe.");

                if (!producto.Activo)
                    throw new InvalidOperationException($"El producto '{producto.Nombre}' no se encuentra activo.");

                if (producto.Stock < item.Cantidad)
                    throw new InvalidOperationException(
                        $"Stock insuficiente para el producto '{producto.Nombre}'. Stock disponible: {producto.Stock}.");

                var subTotal = producto.PrecioVenta * item.Cantidad;
                total += subTotal;

                venta.DetalleVentas.Add(new DetalleVenta
                {
                    IdProducto = producto.IdProducto,
                    Cantidad = item.Cantidad,
                    PrecioUnitario = producto.PrecioVenta,
                    SubTotal = subTotal
                });

                productosVendidos[producto.IdProducto] = producto;
            }

            venta.Total = total;

            // El repositorio persiste venta + detalle + descuento de stock dentro
            // de una única transacción de Entity Framework.
            var ventaRegistrada = await _ventaRepository.RegistrarVentaAsync(venta);

            return ConstruirComprobante(ventaRegistrada, productosVendidos);
        }

        private static ComprobanteVentaDto ConstruirComprobante(Venta venta)
        {
            return new ComprobanteVentaDto
            {
                IdVenta = venta.IdVenta,
                Fecha = venta.Fecha,
                Total = venta.Total,
                Detalle = venta.DetalleVentas.Select(detalle => new ComprobanteDetalleDto
                {
                    IdProducto = detalle.IdProducto,
                    NombreProducto = detalle.Producto?.Nombre ?? string.Empty,
                    Cantidad = detalle.Cantidad,
                    PrecioUnitario = detalle.PrecioUnitario,
                    SubTotal = detalle.SubTotal
                }).ToList()
            };
        }

        private static ComprobanteVentaDto ConstruirComprobante(Venta venta, Dictionary<int, Producto> productos)
        {
            var comprobante = new ComprobanteVentaDto
            {
                IdVenta = venta.IdVenta,
                Fecha = venta.Fecha,
                Total = venta.Total
            };

            foreach (var detalle in venta.DetalleVentas)
            {
                productos.TryGetValue(detalle.IdProducto, out var producto);

                comprobante.Detalle.Add(new ComprobanteDetalleDto
                {
                    IdProducto = detalle.IdProducto,
                    NombreProducto = producto?.Nombre ?? string.Empty,
                    Cantidad = detalle.Cantidad,
                    PrecioUnitario = detalle.PrecioUnitario,
                    SubTotal = detalle.SubTotal
                });
            }

            return comprobante;
        }
    }
}
