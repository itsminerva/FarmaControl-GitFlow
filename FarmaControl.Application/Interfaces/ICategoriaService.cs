using FarmaControl.Application.DTOs;
using FarmaControl.Domain.Entities;

namespace FarmaControl.Application.Interfaces
{
    public interface ICategoriaService
    {
        Task<List<Categoria>> ObtenerTodosAsync();
        Task<Categoria?> ObtenerPorIdAsync(int id);
        Task<Categoria> AgregarAsync(RegistrarCategoriaDto categoriaDto);
        Task<Categoria> ActualizarAsync(int id, RegistrarCategoriaDto categoriaDto);
        Task EliminarAsync(int id);
    }
}
