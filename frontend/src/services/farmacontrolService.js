export function createFarmaControlService(request) {
  return {
    loadAll() {
      return Promise.all([
        request('/Productos'),
        request('/Categorias'),
        request('/Proveedores'),
        request('/Ventas'),
        request('/Alertas?dias=30'),
      ])
    },
    loadAlerts(days) {
      return request(`/Alertas?dias=${days}`)
    },
    createProduct(payload) {
      return request('/Productos', { method: 'POST', body: JSON.stringify(payload) })
    },
    updateProduct(id, payload) {
      return request(`/Productos/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
    },
    deleteProduct(id) {
      return request(`/Productos/${id}`, { method: 'DELETE' })
    },
    createCategory(payload) {
      return request('/Categorias', { method: 'POST', body: JSON.stringify(payload) })
    },
    updateCategory(id, payload) {
      return request(`/Categorias/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
    },
    deleteCategory(id) {
      return request(`/Categorias/${id}`, { method: 'DELETE' })
    },
    createProvider(payload) {
      return request('/Proveedores', { method: 'POST', body: JSON.stringify(payload) })
    },
    updateProvider(id, payload) {
      return request(`/Proveedores/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
    },
    deleteProvider(id) {
      return request(`/Proveedores/${id}`, { method: 'DELETE' })
    },
    registerSale(payload) {
      return request('/Ventas', { method: 'POST', body: JSON.stringify(payload) })
    },
  }
}
