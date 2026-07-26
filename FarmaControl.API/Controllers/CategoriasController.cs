using FarmaControl.Application.DTOs;
using FarmaControl.Application.Interfaces;
using FarmaControl.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace FarmaControl.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasController : ControllerBase
    {
        private readonly ICategoriaService _categoriaService;

        public CategoriasController(ICategoriaService categoriaService)
        {
            _categoriaService = categoriaService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Categoria>>> ObtenerTodos()
        {
            var categorias = await _categoriaService.ObtenerTodosAsync();
            return Ok(categorias);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> ObtenerPorId(int id)
        {
            var categoria = await _categoriaService.ObtenerPorIdAsync(id);

            if (categoria == null)
                return NotFound();

            return Ok(categoria);
        }

        [HttpPost]
        public async Task<ActionResult> Agregar(RegistrarCategoriaDto categoriaDto)
        {
            try
            {
                var categoria = await _categoriaService.AgregarAsync(categoriaDto);
                return Ok(new
                {
                    mensaje = "Categoria agregada correctamente.",
                    categoria.IdCategoria,
                    categoria.Nombre
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Actualizar(int id, RegistrarCategoriaDto categoriaDto)
        {
            try
            {
                var categoria = await _categoriaService.ActualizarAsync(id, categoriaDto);
                return Ok(new
                {
                    mensaje = "Categoria actualizada correctamente.",
                    categoria.IdCategoria,
                    categoria.Nombre
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Eliminar(int id)
        {
            try
            {
                await _categoriaService.EliminarAsync(id);
                return Ok("Categoria eliminada correctamente.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
