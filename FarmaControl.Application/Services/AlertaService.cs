using FarmaControl.Application.DTOs;
using FarmaControl.Application.Interfaces;
using FarmaControl.Domain.Entities;

namespace FarmaControl.Application.Services
{
    public class AlertaService : IAlertaService
    {
        private readonly IProductoRepository _productoRepository;

        public AlertaService(IProductoRepository productoRepository)
        {
            _productoRepository = productoRepository;
        }

        public async Task<List<AlertaVencimientoDto>> ObtenerAlertasAsync(int diasAnticipacion = 30)
        {
            var productos = await _productoRepository.ObtenerProximosAVencerAsync(diasAnticipacion);

            return productos.Select(MapearAlerta).ToList();
        }

        private static AlertaVencimientoDto MapearAlerta(Producto producto)
        {
            return new AlertaVencimientoDto
            {
                IdProducto = producto.IdProducto,
                Codigo = producto.Codigo,
                NombreProducto = producto.Nombre,
                FechaVencimiento = producto.FechaVencimiento,
                DiasParaVencer = (producto.FechaVencimiento.Date - DateTime.Today).Days,
                Stock = producto.Stock
            };
        }
    }
}
