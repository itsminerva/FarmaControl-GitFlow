# FarmaControl - Documentacion del Proyecto

## 1. Descripcion general

FarmaControl es una aplicacion web orientada a la gestion basica de una farmacia. El sistema fue desarrollado como una entrega practica basada en Scrum y cubre las funcionalidades principales del producto minimo viable:

- gestion de medicamentos;
- gestion de categorias;
- gestion de proveedores;
- registro de ventas;
- consulta del historial de ventas;
- visualizacion de alertas de medicamentos proximos a vencer.

El proyecto esta dividido en dos partes principales:

- un **backend** desarrollado en **ASP.NET Core 8** con **Entity Framework Core** y **SQL Server**;
- un **frontend** desarrollado en **React con Vite**, utilizando **Bootstrap** y una interfaz inspirada en el estilo de **SB Admin 2**.

## 2. Estructura del proyecto

La solucion contiene los siguientes modulos principales:

- `FarmaControl.API`: capa de presentacion y exposicion de endpoints REST.
- `FarmaControl.Application`: servicios, DTOs e interfaces de negocio.
- `FarmaControl.Domain`: entidades del dominio.
- `FarmaControl.Persistence`: contexto de datos y repositorios.
- `frontend`: aplicacion cliente en React.
- `script.sql`: script manual para crear la base de datos sin migraciones.

## 3. Tecnologias utilizadas

### Backend

- ASP.NET Core 8
- Entity Framework Core
- SQL Server
- Swagger / OpenAPI
- CORS habilitado para consumo desde el frontend

### Frontend

- React 18
- Vite
- Bootstrap 5
- Bootstrap Icons

## 4. Alcance funcional implementado

El sistema implementa las siguientes capacidades:

### Gestion de inventario

- CRUD de medicamentos con borrado logico.
- CRUD de categorias con borrado logico.
- CRUD de proveedores con borrado logico.

### Ventas

- registro de ventas con uno o varios medicamentos;
- validacion de stock disponible;
- calculo automatico del total;
- descuento del inventario al confirmar la venta;
- generacion de comprobante;
- consulta del historial de ventas.

### Alertas

- consulta de medicamentos activos con stock y proximos a vencer dentro de un rango de dias.

## 5. Base de datos

La base de datos se crea manualmente mediante el archivo `script.sql`.

### Nombre de la base de datos

`FarmaControl`

### Tablas creadas

- `Categorias`
- `Proveedores`
- `Productos`
- `Ventas`
- `DetalleVentas`
- `MovimientosInventario`

### Caracteristicas del modelo

- `Productos`, `Categorias` y `Proveedores` utilizan la columna `Activo` para borrado logico.
- `Productos` almacena informacion de precio, stock, stock minimo y fecha de vencimiento.
- `Ventas` guarda la cabecera de la transaccion.
- `DetalleVentas` guarda los productos vendidos en cada transaccion.
- `MovimientosInventario` permite registrar movimientos asociados al inventario.

### Datos iniciales incluidos

El script inserta datos semilla para facilitar las pruebas manuales:

- categorias;
- proveedores;
- medicamentos de ejemplo.

## 6. Configuracion del backend

### Archivo de configuracion

`FarmaControl.API/appsettings.json`

### Cadena de conexion actual

```json
"DefaultConnection": "Server=localhost;Database=FarmaControl;Trusted_Connection=True;TrustServerCertificate=True;"
```

### Consideraciones

- se requiere tener SQL Server disponible en `localhost`;
- si el servidor o metodo de autenticacion cambian, debe actualizarse la cadena de conexion;
- el backend expone Swagger automaticamente en ambiente de desarrollo.

## 7. Ejecucion del proyecto

### 7.1 Crear la base de datos

1. Abrir SQL Server Management Studio.
2. Ejecutar el archivo `script.sql` completo.
3. Verificar que la base de datos `FarmaControl` fue creada correctamente.

### 7.2 Ejecutar el backend

Desde la raiz del proyecto:

```bash
dotnet run --project "FarmaControl.API/FarmaControl.API.csproj"
```

### 7.3 Ejecutar el frontend

Desde la carpeta `frontend`:

```bash
npm install
npm run dev
```

### 7.4 Construccion de produccion

Backend:

```bash
dotnet build "FarmaControl.API.sln"
```

Frontend:

```bash
npm run build
```

## 8. Arquitectura general del backend

El backend sigue una separacion por capas:

- **API**: recibe solicitudes HTTP y devuelve respuestas.
- **Application**: contiene la logica de negocio.
- **Persistence**: se encarga del acceso a datos mediante Entity Framework Core.
- **Domain**: define las entidades principales del sistema.

### Flujo general

1. El cliente envía una solicitud al controlador.
2. El controlador delega la operacion al servicio correspondiente.
3. El servicio aplica validaciones y reglas de negocio.
4. El repositorio interactua con la base de datos.
5. El resultado vuelve al controlador y se devuelve al cliente.

## 9. Endpoints disponibles

La API utiliza el prefijo base:

`/api`

### 9.1 Productos

Controlador: `ProductosController`

- `GET /api/Productos`
  - lista los productos activos.
- `GET /api/Productos/{id}`
  - obtiene un producto activo por identificador.
- `POST /api/Productos`
  - registra un nuevo medicamento.
- `PUT /api/Productos/{id}`
  - actualiza un medicamento existente.
- `DELETE /api/Productos/{id}`
  - realiza borrado logico del medicamento.

#### Ejemplo de request para crear o actualizar un producto

```json
{
  "codigo": "P010",
  "nombre": "Loratadina 10mg",
  "idCategoria": 2,
  "idProveedor": 1,
  "precioCompra": 20.00,
  "precioVenta": 30.00,
  "stock": 25,
  "stockMinimo": 5,
  "fechaVencimiento": "2027-01-15"
}
```

### 9.2 Categorias

Controlador: `CategoriasController`

- `GET /api/Categorias`
- `GET /api/Categorias/{id}`
- `POST /api/Categorias`
- `PUT /api/Categorias/{id}`
- `DELETE /api/Categorias/{id}`

#### Ejemplo de request

```json
{
  "nombre": "Antiinflamatorios"
}
```

### 9.3 Proveedores

Controlador: `ProveedoresController`

- `GET /api/Proveedores`
- `GET /api/Proveedores/{id}`
- `POST /api/Proveedores`
- `PUT /api/Proveedores/{id}`
- `DELETE /api/Proveedores/{id}`

#### Ejemplo de request

```json
{
  "nombre": "Farmaceutica Central",
  "telefono": "8095551234",
  "email": "ventas@farmacentral.com",
  "direccion": "Santo Domingo"
}
```

### 9.4 Ventas

Controlador: `VentasController`

- `GET /api/Ventas`
  - devuelve el historial de ventas con su detalle.
- `POST /api/Ventas`
  - registra una nueva venta.

#### Ejemplo de request para registrar una venta

```json
{
  "productos": [
    {
      "idProducto": 1,
      "cantidad": 2
    },
    {
      "idProducto": 3,
      "cantidad": 1
    }
  ]
}
```

#### Comportamiento de la venta

Al registrar una venta, el sistema:

- valida que existan los productos;
- verifica que tengan stock suficiente;
- calcula el subtotal por linea y el total general;
- descuenta el inventario;
- guarda la venta y su detalle;
- devuelve un comprobante con la informacion procesada.

### 9.5 Alertas

Controlador: `AlertasController`

- `GET /api/Alertas?dias=30`
  - devuelve los productos activos con stock que vencen dentro del rango indicado.

#### Ejemplo de respuesta esperada

```json
[
  {
    "idProducto": 3,
    "codigo": "P003",
    "nombreProducto": "Ibuprofeno 400mg",
    "fechaVencimiento": "2026-07-20T00:00:00",
    "diasParaVencer": 15,
    "stock": 40
  }
]
```

## 10. Reglas de negocio principales

### Productos

- el nombre es obligatorio;
- el precio no puede ser negativo;
- el stock no puede ser negativo;
- la fecha de vencimiento no puede estar en el pasado;
- el codigo debe ser unico;
- un producto eliminado logicamente deja de aparecer en los listados operativos.

### Categorias

- el nombre es obligatorio;
- no se permiten nombres duplicados activos;
- la categoria `General` no puede eliminarse;
- no se puede eliminar una categoria con productos activos asociados.

### Proveedores

- el nombre es obligatorio;
- se valida el formato basico del correo;
- no se permiten nombres duplicados activos;
- no se puede eliminar un proveedor con productos activos asociados.

### Ventas

- solo se venden productos existentes y activos;
- debe existir stock suficiente;
- el total se calcula automaticamente;
- el inventario se actualiza al completar la venta.

### Alertas

- solo se muestran productos activos;
- solo se muestran productos con stock disponible;
- solo se muestran productos cuya fecha de vencimiento esta dentro del rango consultado.

## 11. Descripcion del frontend

El frontend se encuentra en la carpeta `frontend` y fue desarrollado como un dashboard administrativo.

### Caracteristicas principales

- interfaz responsiva inspirada en SB Admin 2;
- sidebar lateral con navegacion por modulos;
- topbar superior con configuracion de API;
- formularios modales para operaciones CRUD;
- tablas de consulta para inventario, categorias, proveedores y ventas;
- vista de alertas de vencimiento;
- modulo de ventas con resumen y comprobante.

### Modulos del frontend

- **Resumen**: muestra indicadores generales, alertas prioritarias y ventas recientes.
- **Productos**: permite listar, crear, editar y eliminar logicamente medicamentos.
- **Categorias**: permite gestionar categorias.
- **Proveedores**: permite gestionar proveedores.
- **Ventas**: permite registrar ventas y consultar historial.
- **Alertas**: muestra productos proximos a vencer segun el rango seleccionado.

### Configuracion del frontend

El frontend utiliza por defecto la variable:

`VITE_API_BASE_URL`

Si no esta definida, toma como base:

`http://localhost:5121/api`

Adicionalmente, la aplicacion permite cambiar la URL de la API desde la propia interfaz, guardando el valor en `localStorage`.

## 12. Pruebas manuales sugeridas

### Inventario

- crear un producto nuevo;
- editar un producto existente;
- eliminar logicamente un producto;
- verificar que el producto eliminado ya no aparezca en el listado.

### Categorias y proveedores

- registrar una nueva categoria o proveedor;
- intentar duplicar un nombre;
- intentar eliminar una categoria o proveedor con productos asociados.

### Ventas

- registrar una venta con uno o varios productos;
- verificar la disminucion del stock;
- revisar el comprobante generado;
- consultar el historial de ventas.

### Alertas

- consultar alertas con distintos valores del parametro `dias`;
- verificar que solo aparezcan productos activos con stock y proxima fecha de vencimiento.

## 13. Observaciones importantes

- el sistema fue preparado para funcionar sin migraciones; toda la estructura de base de datos se crea con `script.sql`.
- para evitar errores por columnas faltantes, debe ejecutarse el script actualizado antes de probar el sistema.
- el backend tiene CORS habilitado para facilitar la comunicacion con el frontend en desarrollo.

## 14. Estado actual del proyecto

Actualmente, el proyecto cuenta con:

- backend funcional y compilando correctamente;
- frontend funcional y alineado al backend;
- base de datos manual lista para pruebas;
- CRUD completo de productos, categorias y proveedores;
- proceso de ventas operativo;
- historial de ventas disponible;
- alertas de vencimiento disponibles.

## 15. Comandos utiles

### Backend

```bash
dotnet restore
dotnet build "FarmaControl.API.sln"
dotnet run --project "FarmaControl.API/FarmaControl.API.csproj"
```

### Frontend

```bash
npm install
npm run dev
npm run build
```