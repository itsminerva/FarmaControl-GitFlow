using FarmaControl.Application.DTOs;
using FarmaControl.Application.Interfaces;
using FarmaControl.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace FarmaControl.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly IProductoService _productoService;

        public ProductosController(IProductoService productoService)
        {
            _productoService = productoService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Producto>>> ObtenerTodos()
        {
            var productos = await _productoService.ObtenerTodosAsync();
            return Ok(productos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> ObtenerPorId(int id)
        {
            var producto = await _productoService.ObtenerPorIdAsync(id);

            if (producto == null)
                return NotFound();

            return Ok(producto);
        }

        [HttpPost]
        public async Task<ActionResult> Agregar(RegistrarProductoDto productoDto)
        {
            try
            {
                var producto = await _productoService.AgregarAsync(productoDto);
                return Ok(new
                {
                    mensaje = "Producto agregado correctamente.",
                    producto.IdProducto,
                    producto.Codigo
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Actualizar(int id, RegistrarProductoDto productoDto)
        {
            try
            {
                var producto = await _productoService.ActualizarAsync(id, productoDto);
                return Ok(new
                {
                    mensaje = "Producto actualizado correctamente.",
                    producto.IdProducto,
                    producto.Codigo
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
                await _productoService.EliminarAsync(id);
                return Ok("Producto eliminado correctamente.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
