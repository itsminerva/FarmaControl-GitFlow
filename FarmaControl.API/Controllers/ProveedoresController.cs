using FarmaControl.Application.DTOs;
using FarmaControl.Application.Interfaces;
using FarmaControl.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace FarmaControl.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProveedoresController : ControllerBase
    {
        private readonly IProveedorService _proveedorService;

        public ProveedoresController(IProveedorService proveedorService)
        {
            _proveedorService = proveedorService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Proveedor>>> ObtenerTodos()
        {
            var proveedores = await _proveedorService.ObtenerTodosAsync();
            return Ok(proveedores);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Proveedor>> ObtenerPorId(int id)
        {
            var proveedor = await _proveedorService.ObtenerPorIdAsync(id);

            if (proveedor == null)
                return NotFound();

            return Ok(proveedor);
        }

        [HttpPost]
        public async Task<ActionResult> Agregar(RegistrarProveedorDto proveedorDto)
        {
            try
            {
                var proveedor = await _proveedorService.AgregarAsync(proveedorDto);
                return Ok(new
                {
                    mensaje = "Proveedor agregado correctamente.",
                    proveedor.IdProveedor,
                    proveedor.Nombre
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Actualizar(int id, RegistrarProveedorDto proveedorDto)
        {
            try
            {
                var proveedor = await _proveedorService.ActualizarAsync(id, proveedorDto);
                return Ok(new
                {
                    mensaje = "Proveedor actualizado correctamente.",
                    proveedor.IdProveedor,
                    proveedor.Nombre
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
                await _proveedorService.EliminarAsync(id);
                return Ok("Proveedor eliminado correctamente.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
