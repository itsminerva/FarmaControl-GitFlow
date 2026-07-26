using FarmaControl.Application.DTOs;
using FarmaControl.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FarmaControl.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlertasController : ControllerBase
    {
        private readonly IAlertaService _alertaService;

        public AlertasController(IAlertaService alertaService)
        {
            _alertaService = alertaService;
        }

        /// <summary>
        /// GET /api/Alertas — productos activos próximos a vencer.
        /// Por defecto muestra los que vencen en los próximos 30 días.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<AlertaVencimientoDto>>> ObtenerTodas([FromQuery] int dias = 30)
        {
            var alertas = await _alertaService.ObtenerAlertasAsync(dias);
            return Ok(alertas);
        }

    }
}
