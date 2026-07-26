using FarmaControl.Application.DTOs;
using FarmaControl.Application.Interfaces;
using FarmaControl.Domain.Entities;

namespace FarmaControl.Application.Services
{
    public class CategoriaService : ICategoriaService
    {
        private readonly ICategoriaRepository _categoriaRepository;

        public CategoriaService(ICategoriaRepository categoriaRepository)
        {
            _categoriaRepository = categoriaRepository;
        }

        public async Task<List<Categoria>> ObtenerTodosAsync()
        {
            return await _categoriaRepository.ObtenerTodosAsync();
        }

        public async Task<Categoria?> ObtenerPorIdAsync(int id)
        {
            return await _categoriaRepository.ObtenerPorIdAsync(id);
        }

        public async Task<Categoria> AgregarAsync(RegistrarCategoriaDto categoriaDto)
        {
            var categoria = await ConstruirCategoriaAsync(categoriaDto);
            await _categoriaRepository.AgregarAsync(categoria);
            return categoria;
        }

        public async Task<Categoria> ActualizarAsync(int id, RegistrarCategoriaDto categoriaDto)
        {
            var categoria = await _categoriaRepository.ObtenerPorIdAsync(id);

            if (categoria == null)
                throw new InvalidOperationException("La categoria indicada no existe o fue eliminada.");

            categoria = await ConstruirCategoriaAsync(categoriaDto, categoria);
            await _categoriaRepository.ActualizarAsync(categoria);
            return categoria;
        }

        public async Task EliminarAsync(int id)
        {
            var categoria = await _categoriaRepository.ObtenerPorIdAsync(id);

            if (categoria == null)
                throw new InvalidOperationException("La categoria indicada no existe o ya fue eliminada.");

            if (categoria.IdCategoria == 1)
                throw new InvalidOperationException("La categoria General no puede eliminarse.");

            if (await _categoriaRepository.TieneProductosAsociadosAsync(id))
                throw new InvalidOperationException("No puede eliminar la categoria porque tiene medicamentos asociados.");

            categoria.Activo = false;
            await _categoriaRepository.ActualizarAsync(categoria);
        }

        private async Task<Categoria> ConstruirCategoriaAsync(RegistrarCategoriaDto categoriaDto, Categoria? categoriaExistente = null)
        {
            var nombre = (categoriaDto.Nombre ?? string.Empty).Trim();

            if (string.IsNullOrWhiteSpace(nombre))
                throw new InvalidOperationException("El nombre de la categoria es obligatorio.");

            if (nombre.Length > 100)
                throw new InvalidOperationException("El nombre de la categoria no puede exceder 100 caracteres.");

            if (await _categoriaRepository.ExisteNombreAsync(nombre, categoriaExistente?.IdCategoria))
                throw new InvalidOperationException("Ya existe una categoria activa con ese nombre.");

            var categoria = categoriaExistente ?? new Categoria();
            categoria.Nombre = nombre;
            categoria.Activo = true;

            return categoria;
        }
    }
}
