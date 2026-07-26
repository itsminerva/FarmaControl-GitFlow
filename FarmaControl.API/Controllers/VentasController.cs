using FarmaControl.Application.DTOs;
using FarmaControl.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FarmaControl.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VentasController : ControllerBase
    {
        private readonly IVentaService _ventaService;

        public VentasController(IVentaService ventaService)
        {
            _ventaService = ventaService;
        }

        /// <summary>
        /// Registra una venta: valida stock, calcula el total, descuenta el
        /// inventario y devuelve el comprobante generado.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<ComprobanteVentaDto>>> ObtenerTodas()
        {
            var ventas = await _ventaService.ObtenerTodasAsync();
            return Ok(ventas);
        }

        [HttpPost]
        public async Task<ActionResult<ComprobanteVentaDto>> RegistrarVenta(RegistrarVentaDto ventaDto)
        {
            try
            {
                var comprobante = await _ventaService.RegistrarVentaAsync(ventaDto);
                return Ok(comprobante);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
