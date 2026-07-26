using FarmaControl.Domain.Entities;

namespace FarmaControl.Application.Interfaces
{
    public interface IVentaRepository
    {
        Task<List<Venta>> ObtenerTodasAsync();

        /// <summary>
        /// Persiste la venta junto con su detalle y descuenta el stock de cada
        /// producto involucrado dentro de una única transacción de Entity Framework.
        /// </summary>
        Task<Venta> RegistrarVentaAsync(Venta venta);
    }
}
