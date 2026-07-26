using FarmaControl.Application.Interfaces;
using FarmaControl.Domain.Entities;
using FarmaControl.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace FarmaControl.Persistence.Repositories
{
    public class ProveedorRepository : IProveedorRepository
    {
        private readonly FarmaControlDbContext _context;

        public ProveedorRepository(FarmaControlDbContext context)
        {
            _context = context;
        }

        public async Task<List<Proveedor>> ObtenerTodosAsync()
        {
            return await _context.Proveedores
                .Where(p => p.Activo)
                .OrderBy(p => p.Nombre)
                .ToListAsync();
        }

        public async Task<Proveedor?> ObtenerPorIdAsync(int id)
        {
            return await _context.Proveedores
                .FirstOrDefaultAsync(p => p.IdProveedor == id && p.Activo);
        }

        public async Task AgregarAsync(Proveedor proveedor)
        {
            await _context.Proveedores.AddAsync(proveedor);
            await _context.SaveChangesAsync();
        }

        public async Task ActualizarAsync(Proveedor proveedor)
        {
            _context.Proveedores.Update(proveedor);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExisteNombreAsync(string nombre, int? idExcluir = null)
        {
            return await _context.Proveedores.AnyAsync(p => p.Activo && p.Nombre == nombre && (!idExcluir.HasValue || p.IdProveedor != idExcluir.Value));
        }

        public async Task<bool> TieneProductosAsociadosAsync(int idProveedor)
        {
            return await _context.Productos.AnyAsync(p => p.Activo && p.IdProveedor == idProveedor);
        }
    }
}
