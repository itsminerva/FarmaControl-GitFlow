using FarmaControl.Application.DTOs;

namespace FarmaControl.Application.Interfaces
{
    public interface IVentaService
    {
        Task<List<ComprobanteVentaDto>> ObtenerTodasAsync();

        /// <summary>
        /// Procesa una venta: valida stock, calcula totales, registra la venta y su
        /// detalle, actualiza el inventario y devuelve el comprobante generado.
        /// </summary>
        Task<ComprobanteVentaDto> RegistrarVentaAsync(RegistrarVentaDto ventaDto);
    }
}
