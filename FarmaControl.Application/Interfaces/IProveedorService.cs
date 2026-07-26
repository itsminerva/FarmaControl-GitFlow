using FarmaControl.Application.DTOs;
using FarmaControl.Domain.Entities;

namespace FarmaControl.Application.Interfaces
{
    public interface IProveedorService
    {
        Task<List<Proveedor>> ObtenerTodosAsync();
        Task<Proveedor?> ObtenerPorIdAsync(int id);
        Task<Proveedor> AgregarAsync(RegistrarProveedorDto proveedorDto);
        Task<Proveedor> ActualizarAsync(int id, RegistrarProveedorDto proveedorDto);
        Task EliminarAsync(int id);
    }
}
