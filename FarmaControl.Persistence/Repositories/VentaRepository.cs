using FarmaControl.Application.Interfaces;
using FarmaControl.Domain.Entities;
using FarmaControl.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace FarmaControl.Persistence.Repositories
{
    public class VentaRepository : IVentaRepository
    {
        private readonly FarmaControlDbContext _context;

        public VentaRepository(FarmaControlDbContext context)
        {
            _context = context;
        }

        public async Task<List<Venta>> ObtenerTodasAsync()
        {
            return await _context.Ventas
                .Include(v => v.DetalleVentas)
                .ThenInclude(d => d.Producto)
                .OrderByDescending(v => v.Fecha)
                .ThenByDescending(v => v.IdVenta)
                .ToListAsync();
        }

        public async Task<Venta> RegistrarVentaAsync(Venta venta)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                foreach (var detalle in venta.DetalleVentas)
                {
                    var producto = await _context.Productos
                        .FirstOrDefaultAsync(p => p.IdProducto == detalle.IdProducto);

                    if (producto == null)
                        throw new InvalidOperationException($"El producto con ID {detalle.IdProducto} no existe.");

                    if (!producto.Activo)
                        throw new InvalidOperationException($"El producto '{producto.Nombre}' no se encuentra activo.");

                    if (producto.Stock < detalle.Cantidad)
                        throw new InvalidOperationException(
                            $"Stock insuficiente para el producto '{producto.Nombre}'. Stock disponible: {producto.Stock}.");

                    // Descuenta el stock; el cambio queda registrado por el change tracker de EF.
                    producto.Stock -= detalle.Cantidad;

                    // Traza del movimiento de inventario generado por la venta.
                    _context.MovimientosInventario.Add(new MovimientoInventario
                    {
                        IdProducto = producto.IdProducto,
                        TipoMovimiento = "SALIDA",
                        Cantidad = detalle.Cantidad,
                        Fecha = venta.Fecha,
                        Observacion = "Salida por venta"
                    });
                }

                await _context.Ventas.AddAsync(venta);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return venta;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}
