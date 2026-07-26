using FarmaControl.Application.Interfaces;
using FarmaControl.Domain.Entities;
using FarmaControl.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace FarmaControl.Persistence.Repositories
{
    public class ProductoRepository : IProductoRepository
    {
        private readonly FarmaControlDbContext _context;

        public ProductoRepository(FarmaControlDbContext context)
        {
            _context = context;
        }

        public async Task<List<Producto>> ObtenerTodosAsync()
        {
            return await _context.Productos
                .Where(p => p.Activo)
                .Include(p => p.Categoria)
                .Include(p => p.Proveedor)
                .OrderBy(p => p.Nombre)
                .ToListAsync();
        }

        public async Task<Producto?> ObtenerPorIdAsync(int id)
        {
            return await _context.Productos
                .Where(p => p.Activo)
                .Include(p => p.Categoria)
                .Include(p => p.Proveedor)
                .FirstOrDefaultAsync(p => p.IdProducto == id);
        }

        public async Task AgregarAsync(Producto producto)
        {
            await _context.Productos.AddAsync(producto);
            await _context.SaveChangesAsync();
        }

        public async Task ActualizarAsync(Producto producto)
        {
            _context.Productos.Update(producto);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExisteCodigoAsync(string codigo, int? idExcluir = null)
        {
            return await _context.Productos.AnyAsync(p => p.Codigo == codigo && (!idExcluir.HasValue || p.IdProducto != idExcluir.Value));
        }

        public async Task<List<Producto>> ObtenerProximosAVencerAsync(int diasAnticipacion)
        {
            var hoy = DateTime.Today;
            var fechaLimite = hoy.AddDays(diasAnticipacion);

            return await _context.Productos
                .Where(p => p.Activo
                    && p.Stock > 0
                    && p.FechaVencimiento.Date >= hoy
                    && p.FechaVencimiento.Date <= fechaLimite)
                .OrderBy(p => p.FechaVencimiento)
                .ToListAsync();
        }
    }
}
