using FarmaControl.Application.DTOs;
using FarmaControl.Application.Interfaces;
using FarmaControl.Domain.Entities;

namespace FarmaControl.Application.Services
{
    public class ProductoService : IProductoService
    {
        private readonly IProductoRepository _productoRepository;
        private readonly ICategoriaRepository _categoriaRepository;
        private readonly IProveedorRepository _proveedorRepository;

        public ProductoService(
            IProductoRepository productoRepository,
            ICategoriaRepository categoriaRepository,
            IProveedorRepository proveedorRepository)
        {
            _productoRepository = productoRepository;
            _categoriaRepository = categoriaRepository;
            _proveedorRepository = proveedorRepository;
        }

        public async Task<List<Producto>> ObtenerTodosAsync()
        {
            return await _productoRepository.ObtenerTodosAsync();
        }

        public async Task<Producto?> ObtenerPorIdAsync(int id)
        {
            return await _productoRepository.ObtenerPorIdAsync(id);
        }

        public async Task<Producto> AgregarAsync(RegistrarProductoDto productoDto)
        {
            var codigo = await ResolverCodigoAsync(productoDto.Codigo);
            var producto = await ConstruirProductoAsync(productoDto, null, codigo);

            await _productoRepository.AgregarAsync(producto);

            return producto;
        }

        public async Task<Producto> ActualizarAsync(int id, RegistrarProductoDto productoDto)
        {
            var producto = await _productoRepository.ObtenerPorIdAsync(id);

            if (producto == null)
                throw new InvalidOperationException("El medicamento indicado no existe o fue eliminado.");

            var codigo = await ResolverCodigoAsync(productoDto.Codigo ?? producto.Codigo, id);
            var productoActualizado = await ConstruirProductoAsync(productoDto, producto, codigo);

            await _productoRepository.ActualizarAsync(productoActualizado);

            return productoActualizado;
        }

        public async Task EliminarAsync(int id)
        {
            var producto = await _productoRepository.ObtenerPorIdAsync(id);

            if (producto == null)
                throw new InvalidOperationException("El medicamento indicado no existe o ya fue eliminado.");

            producto.Activo = false;
            await _productoRepository.ActualizarAsync(producto);
        }

        private async Task<Producto> ConstruirProductoAsync(
            RegistrarProductoDto productoDto,
            Producto? productoExistente,
            string codigo)
        {
            var nombre = (productoDto.Nombre ?? string.Empty).Trim();

            if (string.IsNullOrWhiteSpace(nombre))
                throw new InvalidOperationException("El nombre del medicamento es obligatorio.");

            var precioVenta = productoDto.PrecioVenta ?? productoDto.Precio;

            if (!precioVenta.HasValue)
                throw new InvalidOperationException("Debe indicar el precio del medicamento.");

            if (precioVenta.Value < 0)
                throw new InvalidOperationException("El precio del medicamento no puede ser negativo.");

            var stock = productoDto.Stock ?? productoDto.CantidadDisponible;

            if (!stock.HasValue)
                throw new InvalidOperationException("Debe indicar la cantidad disponible del medicamento.");

            if (stock.Value < 0)
                throw new InvalidOperationException("La cantidad disponible no puede ser negativa.");

            if (productoDto.IdProveedor <= 0)
                throw new InvalidOperationException("Debe seleccionar un proveedor válido.");

            if (productoDto.FechaVencimiento.Date < DateTime.Today)
                throw new InvalidOperationException("La fecha de vencimiento no puede estar en el pasado.");

            var idCategoria = productoDto.IdCategoria.GetValueOrDefault(1);

            if (await _categoriaRepository.ObtenerPorIdAsync(idCategoria) == null)
                throw new InvalidOperationException("La categoría indicada no existe.");

            if (await _proveedorRepository.ObtenerPorIdAsync(productoDto.IdProveedor) == null)
                throw new InvalidOperationException("El proveedor indicado no existe.");

            var precioCompra = productoDto.PrecioCompra ?? precioVenta.Value;
            var stockMinimo = productoDto.StockMinimo.GetValueOrDefault(5);

            if (precioCompra < 0)
                throw new InvalidOperationException("El precio de compra no puede ser negativo.");

            if (stockMinimo < 0)
                throw new InvalidOperationException("El stock mínimo no puede ser negativo.");

            var producto = productoExistente ?? new Producto();
            producto.Codigo = codigo;
            producto.Nombre = nombre;
            producto.IdCategoria = idCategoria;
            producto.IdProveedor = productoDto.IdProveedor;
            producto.PrecioCompra = precioCompra;
            producto.PrecioVenta = precioVenta.Value;
            producto.Stock = stock.Value;
            producto.StockMinimo = stockMinimo;
            producto.FechaVencimiento = productoDto.FechaVencimiento.Date;
            producto.Activo = true;

            return producto;
        }

        private async Task<string> ResolverCodigoAsync(string? codigoRecibido, int? idExcluir = null)
        {
            if (!string.IsNullOrWhiteSpace(codigoRecibido))
            {
                var codigo = codigoRecibido.Trim().ToUpperInvariant();

                if (await _productoRepository.ExisteCodigoAsync(codigo, idExcluir))
                    throw new InvalidOperationException("Ya existe un medicamento registrado con ese código.");

                return codigo;
            }

            string codigoGenerado;

            do
            {
                codigoGenerado = $"MED-{DateTime.UtcNow:yyyyMMddHHmmssfff}";
                await Task.Delay(1);
            }
            while (await _productoRepository.ExisteCodigoAsync(codigoGenerado, idExcluir));

            return codigoGenerado;
        }
    }
}
