using FarmaControl.Application.DTOs;
using FarmaControl.Application.Interfaces;
using FarmaControl.Domain.Entities;

namespace FarmaControl.Application.Services
{
    public class ProveedorService : IProveedorService
    {
        private readonly IProveedorRepository _proveedorRepository;

        public ProveedorService(IProveedorRepository proveedorRepository)
        {
            _proveedorRepository = proveedorRepository;
        }

        public async Task<List<Proveedor>> ObtenerTodosAsync()
        {
            return await _proveedorRepository.ObtenerTodosAsync();
        }

        public async Task<Proveedor?> ObtenerPorIdAsync(int id)
        {
            return await _proveedorRepository.ObtenerPorIdAsync(id);
        }

        public async Task<Proveedor> AgregarAsync(RegistrarProveedorDto proveedorDto)
        {
            var proveedor = await ConstruirProveedorAsync(proveedorDto);
            await _proveedorRepository.AgregarAsync(proveedor);
            return proveedor;
        }

        public async Task<Proveedor> ActualizarAsync(int id, RegistrarProveedorDto proveedorDto)
        {
            var proveedor = await _proveedorRepository.ObtenerPorIdAsync(id);

            if (proveedor == null)
                throw new InvalidOperationException("El proveedor indicado no existe o fue eliminado.");

            proveedor = await ConstruirProveedorAsync(proveedorDto, proveedor);
            await _proveedorRepository.ActualizarAsync(proveedor);
            return proveedor;
        }

        public async Task EliminarAsync(int id)
        {
            var proveedor = await _proveedorRepository.ObtenerPorIdAsync(id);

            if (proveedor == null)
                throw new InvalidOperationException("El proveedor indicado no existe o ya fue eliminado.");

            if (await _proveedorRepository.TieneProductosAsociadosAsync(id))
                throw new InvalidOperationException("No puede eliminar el proveedor porque tiene medicamentos asociados.");

            proveedor.Activo = false;
            await _proveedorRepository.ActualizarAsync(proveedor);
        }

        private async Task<Proveedor> ConstruirProveedorAsync(RegistrarProveedorDto proveedorDto, Proveedor? proveedorExistente = null)
        {
            var nombre = (proveedorDto.Nombre ?? string.Empty).Trim();
            var telefono = LimpiarTexto(proveedorDto.Telefono);
            var email = LimpiarTexto(proveedorDto.Email);
            var direccion = LimpiarTexto(proveedorDto.Direccion);

            if (string.IsNullOrWhiteSpace(nombre))
                throw new InvalidOperationException("El nombre del proveedor es obligatorio.");

            if (nombre.Length > 150)
                throw new InvalidOperationException("El nombre del proveedor no puede exceder 150 caracteres.");

            if (telefono != null && telefono.Length > 20)
                throw new InvalidOperationException("El telefono del proveedor no puede exceder 20 caracteres.");

            if (email != null)
            {
                if (email.Length > 100)
                    throw new InvalidOperationException("El correo del proveedor no puede exceder 100 caracteres.");

                if (!email.Contains('@'))
                    throw new InvalidOperationException("El correo del proveedor no tiene un formato valido.");
            }

            if (direccion != null && direccion.Length > 200)
                throw new InvalidOperationException("La direccion del proveedor no puede exceder 200 caracteres.");

            if (await _proveedorRepository.ExisteNombreAsync(nombre, proveedorExistente?.IdProveedor))
                throw new InvalidOperationException("Ya existe un proveedor activo con ese nombre.");

            var proveedor = proveedorExistente ?? new Proveedor();
            proveedor.Nombre = nombre;
            proveedor.Telefono = telefono;
            proveedor.Email = email;
            proveedor.Direccion = direccion;
            proveedor.Activo = true;

            return proveedor;
        }

        private static string? LimpiarTexto(string? valor)
        {
            if (string.IsNullOrWhiteSpace(valor))
                return null;

            return valor.Trim();
        }
    }
}
