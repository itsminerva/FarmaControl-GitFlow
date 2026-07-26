IF DB_ID(N'FarmaControl') IS NULL
BEGIN
    CREATE DATABASE [FarmaControl];
END
GO

USE [FarmaControl];
GO

SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

IF OBJECT_ID(N'dbo.DetalleVentas', N'U') IS NOT NULL DROP TABLE dbo.DetalleVentas;
IF OBJECT_ID(N'dbo.MovimientosInventario', N'U') IS NOT NULL DROP TABLE dbo.MovimientosInventario;
IF OBJECT_ID(N'dbo.Ventas', N'U') IS NOT NULL DROP TABLE dbo.Ventas;
IF OBJECT_ID(N'dbo.Productos', N'U') IS NOT NULL DROP TABLE dbo.Productos;
IF OBJECT_ID(N'dbo.Proveedores', N'U') IS NOT NULL DROP TABLE dbo.Proveedores;
IF OBJECT_ID(N'dbo.Categorias', N'U') IS NOT NULL DROP TABLE dbo.Categorias;
GO

CREATE TABLE dbo.Categorias
(
    IdCategoria INT IDENTITY(1,1) NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Activo BIT NOT NULL CONSTRAINT DF_Categorias_Activo DEFAULT (1),
    CONSTRAINT PK_Categorias PRIMARY KEY (IdCategoria),
    CONSTRAINT UQ_Categorias_Nombre UNIQUE (Nombre)
);
GO

CREATE TABLE dbo.Proveedores
(
    IdProveedor INT IDENTITY(1,1) NOT NULL,
    Nombre VARCHAR(150) NOT NULL,
    Telefono VARCHAR(20) NULL,
    Email VARCHAR(100) NULL,
    Direccion VARCHAR(200) NULL,
    Activo BIT NOT NULL CONSTRAINT DF_Proveedores_Activo DEFAULT (1),
    CONSTRAINT PK_Proveedores PRIMARY KEY (IdProveedor)
);
GO

CREATE UNIQUE INDEX IX_Proveedores_Nombre ON dbo.Proveedores (Nombre);
GO

CREATE TABLE dbo.Productos
(
    IdProducto INT IDENTITY(1,1) NOT NULL,
    Codigo VARCHAR(30) NOT NULL,
    Nombre VARCHAR(150) NOT NULL,
    IdCategoria INT NOT NULL,
    IdProveedor INT NOT NULL,
    PrecioCompra DECIMAL(10,2) NOT NULL,
    PrecioVenta DECIMAL(10,2) NOT NULL,
    Stock INT NOT NULL CONSTRAINT DF_Productos_Stock DEFAULT (0),
    StockMinimo INT NOT NULL CONSTRAINT DF_Productos_StockMinimo DEFAULT (5),
    FechaVencimiento DATE NOT NULL,
    Activo BIT NOT NULL CONSTRAINT DF_Productos_Activo DEFAULT (1),
    CONSTRAINT PK_Productos PRIMARY KEY (IdProducto),
    CONSTRAINT UQ_Productos_Codigo UNIQUE (Codigo),
    CONSTRAINT FK_Productos_Categorias FOREIGN KEY (IdCategoria) REFERENCES dbo.Categorias(IdCategoria),
    CONSTRAINT FK_Productos_Proveedores FOREIGN KEY (IdProveedor) REFERENCES dbo.Proveedores(IdProveedor),
    CONSTRAINT CK_Productos_PrecioCompra CHECK (PrecioCompra >= 0),
    CONSTRAINT CK_Productos_PrecioVenta CHECK (PrecioVenta >= 0),
    CONSTRAINT CK_Productos_Stock CHECK (Stock >= 0),
    CONSTRAINT CK_Productos_StockMinimo CHECK (StockMinimo >= 0)
);
GO

CREATE TABLE dbo.Ventas
(
    IdVenta INT IDENTITY(1,1) NOT NULL,
    Fecha DATETIME NOT NULL CONSTRAINT DF_Ventas_Fecha DEFAULT (GETDATE()),
    Total DECIMAL(10,2) NOT NULL,
    CONSTRAINT PK_Ventas PRIMARY KEY (IdVenta),
    CONSTRAINT CK_Ventas_Total CHECK (Total >= 0)
);
GO

CREATE TABLE dbo.DetalleVentas
(
    IdDetalleVenta INT IDENTITY(1,1) NOT NULL,
    IdVenta INT NOT NULL,
    IdProducto INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(10,2) NOT NULL,
    SubTotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT PK_DetalleVentas PRIMARY KEY (IdDetalleVenta),
    CONSTRAINT FK_DetalleVentas_Ventas FOREIGN KEY (IdVenta) REFERENCES dbo.Ventas(IdVenta),
    CONSTRAINT FK_DetalleVentas_Productos FOREIGN KEY (IdProducto) REFERENCES dbo.Productos(IdProducto),
    CONSTRAINT CK_DetalleVentas_Cantidad CHECK (Cantidad > 0),
    CONSTRAINT CK_DetalleVentas_PrecioUnitario CHECK (PrecioUnitario >= 0),
    CONSTRAINT CK_DetalleVentas_SubTotal CHECK (SubTotal >= 0)
);
GO

CREATE TABLE dbo.MovimientosInventario
(
    IdMovimiento INT IDENTITY(1,1) NOT NULL,
    IdProducto INT NOT NULL,
    TipoMovimiento VARCHAR(20) NOT NULL,
    Cantidad INT NOT NULL,
    Fecha DATETIME NOT NULL CONSTRAINT DF_MovimientosInventario_Fecha DEFAULT (GETDATE()),
    Observacion VARCHAR(250) NULL,
    CONSTRAINT PK_MovimientosInventario PRIMARY KEY (IdMovimiento),
    CONSTRAINT FK_MovimientosInventario_Productos FOREIGN KEY (IdProducto) REFERENCES dbo.Productos(IdProducto),
    CONSTRAINT CK_MovimientosInventario_Cantidad CHECK (Cantidad > 0)
);
GO

INSERT INTO dbo.Categorias (Nombre, Activo)
VALUES
    ('General', 1),
    ('Analgesicos', 1),
    ('Antibioticos', 1),
    ('Vitaminas', 1);
GO

INSERT INTO dbo.Proveedores (Nombre, Telefono, Email, Direccion, Activo)
VALUES
    ('Distribuidora Farmaceutica ABC', '8091234567', 'contacto@abc.com', 'Santo Domingo', 1),
    ('Laboratorios Salud Total', '8095550101', 'ventas@saludtotal.com', 'Santiago', 1);
GO

INSERT INTO dbo.Productos
(
    Codigo,
    Nombre,
    IdCategoria,
    IdProveedor,
    PrecioCompra,
    PrecioVenta,
    Stock,
    StockMinimo,
    FechaVencimiento,
    Activo
)
VALUES
    ('P001', 'Paracetamol 500mg', 2, 1, 10.00, 15.00, 50, 10, '2027-01-01', 1),
    ('P002', 'Amoxicilina 500mg', 3, 2, 18.00, 25.00, 25, 8, '2026-08-15', 1),
    ('P003', 'Ibuprofeno 400mg', 2, 1, 12.00, 18.00, 40, 10, '2026-07-20', 1),
    ('P004', 'Vitamina C 1g', 4, 2, 14.00, 22.00, 30, 6, '2027-03-10', 1);
GO
