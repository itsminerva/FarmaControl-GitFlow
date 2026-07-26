using FarmaControl.Domain.Entities;

namespace FarmaControl.Application.Interfaces
{
    public interface IProductoRepository
    {
        Task<List<Producto>> ObtenerTodosAsync();
        Task<Producto?> ObtenerPorIdAsync(int id);
        Task AgregarAsync(Producto producto);
        Task ActualizarAsync(Producto producto);
        Task<bool> ExisteCodigoAsync(string codigo, int? idExcluir = null);

        /// <summary>
        /// Devuelve los productos activos cuya fecha de vencimiento cae dentro de
        /// los próximos "diasAnticipacion" días (incluye vencimientos de hoy en adelante).
        /// </summary>
        Task<List<Producto>> ObtenerProximosAVencerAsync(int diasAnticipacion);
    }
}
