using FarmaControl.Application.Interfaces;
using FarmaControl.Domain.Entities;
using FarmaControl.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace FarmaControl.Persistence.Repositories
{
    public class CategoriaRepository : ICategoriaRepository
    {
        private readonly FarmaControlDbContext _context;

        public CategoriaRepository(FarmaControlDbContext context)
        {
            _context = context;
        }

        public async Task<List<Categoria>> ObtenerTodosAsync()
        {
            return await _context.Categorias
                .Where(c => c.Activo)
                .OrderBy(c => c.Nombre)
                .ToListAsync();
        }

        public async Task<Categoria?> ObtenerPorIdAsync(int id)
        {
            return await _context.Categorias
                .FirstOrDefaultAsync(c => c.IdCategoria == id && c.Activo);
        }

        public async Task AgregarAsync(Categoria categoria)
        {
            await _context.Categorias.AddAsync(categoria);
            await _context.SaveChangesAsync();
        }

        public async Task ActualizarAsync(Categoria categoria)
        {
            _context.Categorias.Update(categoria);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExisteNombreAsync(string nombre, int? idExcluir = null)
        {
            return await _context.Categorias.AnyAsync(c => c.Activo && c.Nombre == nombre && (!idExcluir.HasValue || c.IdCategoria != idExcluir.Value));
        }

        public async Task<bool> TieneProductosAsociadosAsync(int idCategoria)
        {
            return await _context.Productos.AnyAsync(p => p.Activo && p.IdCategoria == idCategoria);
        }
    }
}
