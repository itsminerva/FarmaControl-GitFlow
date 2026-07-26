using FarmaControl.Application.DTOs;
using FarmaControl.Domain.Entities;

namespace FarmaControl.Application.Interfaces
{
    public interface IProductoService
    {
        Task<List<Producto>> ObtenerTodosAsync();
        Task<Producto?> ObtenerPorIdAsync(int id);
        Task<Producto> AgregarAsync(RegistrarProductoDto productoDto);
        Task<Producto> ActualizarAsync(int id, RegistrarProductoDto productoDto);
        Task EliminarAsync(int id);
    }
}
