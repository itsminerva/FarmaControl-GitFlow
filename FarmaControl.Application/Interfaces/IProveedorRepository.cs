using FarmaControl.Domain.Entities;

namespace FarmaControl.Application.Interfaces
{
    public interface IProveedorRepository
    {
        Task<List<Proveedor>> ObtenerTodosAsync();
        Task<Proveedor?> ObtenerPorIdAsync(int id);
        Task AgregarAsync(Proveedor proveedor);
        Task ActualizarAsync(Proveedor proveedor);
        Task<bool> ExisteNombreAsync(string nombre, int? idExcluir = null);
        Task<bool> TieneProductosAsociadosAsync(int idProveedor);
    }
}
