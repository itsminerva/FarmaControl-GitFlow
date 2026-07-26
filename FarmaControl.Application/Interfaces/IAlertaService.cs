using FarmaControl.Application.DTOs;

namespace FarmaControl.Application.Interfaces
{
    public interface IAlertaService
    {
        /// <summary>
        /// Devuelve las alertas de productos próximos a vencer dentro de los
        /// próximos "diasAnticipacion" días (30 por defecto).
        /// </summary>
        Task<List<AlertaVencimientoDto>> ObtenerAlertasAsync(int diasAnticipacion = 30);

    }
}
