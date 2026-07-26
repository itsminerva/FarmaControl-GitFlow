export const views = [
  { key: 'dashboard', label: 'Resumen' },
  { key: 'productos', label: 'Productos' },
  { key: 'categorias', label: 'Categorias' },
  { key: 'proveedores', label: 'Proveedores' },
  { key: 'ventas', label: 'Ventas' },
  { key: 'alertas', label: 'Alertas' },
]

export const emptyProduct = {
  codigo: '',
  nombre: '',
  idCategoria: '',
  idProveedor: '',
  precioCompra: '',
  precioVenta: '',
  stock: '',
  stockMinimo: '',
  fechaVencimiento: '',
}

export const emptyCategory = { nombre: '' }

export const emptyProvider = {
  nombre: '',
  telefono: '',
  email: '',
  direccion: '',
}
