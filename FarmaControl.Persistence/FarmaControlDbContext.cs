using FarmaControl.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FarmaControl.Persistence.Context
{
    public class FarmaControlDbContext : DbContext
    {
        public FarmaControlDbContext(DbContextOptions<FarmaControlDbContext> options)
            : base(options)
        {
        }

        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Proveedor> Proveedores { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Venta> Ventas { get; set; }
        public DbSet<DetalleVenta> DetalleVentas { get; set; }
        public DbSet<MovimientoInventario> MovimientosInventario { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Categoria>().HasKey(c => c.IdCategoria);
            modelBuilder.Entity<Proveedor>().HasKey(p => p.IdProveedor);
            modelBuilder.Entity<Producto>().HasKey(p => p.IdProducto);
            modelBuilder.Entity<Venta>().HasKey(v => v.IdVenta);
            modelBuilder.Entity<DetalleVenta>().HasKey(d => d.IdDetalleVenta);
            modelBuilder.Entity<MovimientoInventario>().HasKey(m => m.IdMovimiento);

            // Relaciones - Producto
            modelBuilder.Entity<Producto>()
                .HasOne(p => p.Categoria)
                .WithMany()
                .HasForeignKey(p => p.IdCategoria)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Producto>()
                .HasOne(p => p.Proveedor)
                .WithMany()
                .HasForeignKey(p => p.IdProveedor)
                .OnDelete(DeleteBehavior.Restrict);

            // Relaciones - Venta / DetalleVenta
            // Cascade únicamente en este lado: al eliminar una venta se eliminan sus líneas de detalle.
            modelBuilder.Entity<DetalleVenta>()
                .HasOne(d => d.Venta)
                .WithMany(v => v.DetalleVentas)
                .HasForeignKey(d => d.IdVenta)
                .OnDelete(DeleteBehavior.Cascade);

            // Restrict aquí: evita el error de EF "multiple cascade paths" al tener
            // dos rutas de borrado en cascada (Venta y Producto) llegando a DetalleVenta.
            modelBuilder.Entity<DetalleVenta>()
                .HasOne(d => d.Producto)
                .WithMany()
                .HasForeignKey(d => d.IdProducto)
                .OnDelete(DeleteBehavior.Restrict);

            // Relaciones - MovimientoInventario
            modelBuilder.Entity<MovimientoInventario>()
                .HasOne(m => m.Producto)
                .WithMany()
                .HasForeignKey(m => m.IdProducto)
                .OnDelete(DeleteBehavior.Restrict);

            // Precisión de campos monetarios: por defecto SQL Server usa decimal(18,0)
            // y trunca los decimales silenciosamente.
            modelBuilder.Entity<Producto>().Property(p => p.Codigo).HasMaxLength(30);
            modelBuilder.Entity<Producto>().Property(p => p.Nombre).HasMaxLength(150);
            modelBuilder.Entity<Producto>().Property(p => p.FechaVencimiento).HasColumnType("date");
            modelBuilder.Entity<Producto>().Property(p => p.PrecioCompra).HasPrecision(10, 2);
            modelBuilder.Entity<Producto>().Property(p => p.PrecioVenta).HasPrecision(10, 2);
            modelBuilder.Entity<Venta>().Property(v => v.Total).HasPrecision(10, 2);
            modelBuilder.Entity<DetalleVenta>().Property(d => d.PrecioUnitario).HasPrecision(10, 2);
            modelBuilder.Entity<DetalleVenta>().Property(d => d.SubTotal).HasPrecision(10, 2);

            modelBuilder.Entity<Categoria>().Property(c => c.Nombre).HasMaxLength(100);
            modelBuilder.Entity<Categoria>().Property(c => c.Activo).HasDefaultValue(true);
            modelBuilder.Entity<Proveedor>().Property(p => p.Nombre).HasMaxLength(150);
            modelBuilder.Entity<Proveedor>().Property(p => p.Telefono).HasMaxLength(20);
            modelBuilder.Entity<Proveedor>().Property(p => p.Email).HasMaxLength(100);
            modelBuilder.Entity<Proveedor>().Property(p => p.Direccion).HasMaxLength(200);
            modelBuilder.Entity<Proveedor>().Property(p => p.Activo).HasDefaultValue(true);
            modelBuilder.Entity<MovimientoInventario>().Property(m => m.TipoMovimiento).HasMaxLength(20);
            modelBuilder.Entity<MovimientoInventario>().Property(m => m.Observacion).HasMaxLength(250);

            modelBuilder.Entity<Categoria>().HasIndex(c => c.Nombre).IsUnique();
            modelBuilder.Entity<Proveedor>().HasIndex(p => p.Nombre).IsUnique();
            modelBuilder.Entity<Producto>().HasIndex(p => p.Codigo).IsUnique();
        }
    }
}
