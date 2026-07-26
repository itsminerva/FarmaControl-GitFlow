using FarmaControl.Domain.Entities;

namespace FarmaControl.Application.Interfaces
{
    public interface ICategoriaRepository
    {
        Task<List<Categoria>> ObtenerTodosAsync();
        Task<Categoria?> ObtenerPorIdAsync(int id);
        Task AgregarAsync(Categoria categoria);
        Task ActualizarAsync(Categoria categoria);
        Task<bool> ExisteNombreAsync(string nombre, int? idExcluir = null);
        Task<bool> TieneProductosAsociadosAsync(int idCategoria);
    }
}
