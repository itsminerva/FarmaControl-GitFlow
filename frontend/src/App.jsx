import { useEffect, useMemo, useState } from 'react'
import { apiFetch, getStoredApiBase, setStoredApiBase } from './api'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import ProductModal from './components/modals/ProductModal'
import CategoryModal from './components/modals/CategoryModal'
import ProviderModal from './components/modals/ProviderModal'
import ApiConfigModal from './components/modals/ApiConfigModal'
import DashboardPage from './pages/DashboardPage'
import ProductosPage from './pages/ProductosPage'
import CategoriasPage from './pages/CategoriasPage'
import ProveedoresPage from './pages/ProveedoresPage'
import VentasPage from './pages/VentasPage'
import AlertasPage from './pages/AlertasPage'
import { emptyCategory, emptyProduct, emptyProvider } from './constants/views'
import { createFarmaControlService } from './services/farmacontrolService'

function App() {
  const [apiBase, setApiBase] = useState(getStoredApiBase())
  const [view, setView] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [alertDays, setAlertDays] = useState(30)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [providers, setProviders] = useState([])
  const [sales, setSales] = useState([])
  const [alerts, setAlerts] = useState([])
  const [productFilter, setProductFilter] = useState('')
  const [saleItems, setSaleItems] = useState([])
  const [lastReceipt, setLastReceipt] = useState(null)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [productModal, setProductModal] = useState({ open: false, mode: 'create', data: emptyProduct, id: null })
  const [categoryModal, setCategoryModal] = useState({ open: false, mode: 'create', data: emptyCategory, id: null })
  const [providerModal, setProviderModal] = useState({ open: false, mode: 'create', data: emptyProvider, id: null })
  const [apiModalOpen, setApiModalOpen] = useState(false)
  const [draftApiBase, setDraftApiBase] = useState(apiBase)

  const service = useMemo(() => createFarmaControlService(request), [apiBase])

  useEffect(() => {
    void loadAll()
  }, [])

  useEffect(() => {
    if (view === 'alertas') {
      void loadAlerts(alertDays)
    }
  }, [alertDays, view])

  useEffect(() => {
    setDraftApiBase(apiBase)
  }, [apiBase])

  const lowStockCount = useMemo(
    () => products.filter((item) => item.stock <= item.stockMinimo).length,
    [products],
  )

  const todaySales = useMemo(() => {
    const today = new Date().toDateString()
    return sales.filter((sale) => new Date(sale.fecha).toDateString() === today)
  }, [sales])

  const todaySalesTotal = useMemo(
    () => todaySales.reduce((sum, sale) => sum + Number(sale.total || 0), 0),
    [todaySales],
  )

  const filteredProducts = useMemo(() => {
    const query = productFilter.trim().toLowerCase()
    if (!query) return products
    return products.filter((item) => item.nombre.toLowerCase().includes(query) || item.codigo.toLowerCase().includes(query))
  }, [products, productFilter])

  const saleTotal = useMemo(
    () => saleItems.reduce((sum, item) => sum + getSaleItemSubtotal(item), 0),
    [saleItems, products],
  )

  async function request(path, options = {}) {
    setError('')
    return apiFetch(apiBase, path, options)
  }

  async function loadAll() {
    setLoading(true)
    try {
      const [productsData, categoriesData, providersData, salesData, alertsData] = await service.loadAll()
      setProducts(productsData)
      setCategories(categoriesData)
      setProviders(providersData)
      setSales(salesData)
      setAlerts(alertsData)
      setSaleItems((current) => current.length ? current : buildInitialSaleItems(productsData))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadAlerts(days = alertDays) {
    try {
      setAlerts(await service.loadAlerts(days))
    } catch (err) {
      setError(err.message)
    }
  }

  function showMessage(text) {
    setMessage(text)
    window.clearTimeout(showMessage.timeout)
    showMessage.timeout = window.setTimeout(() => setMessage(''), 3500)
  }

  function getCategoryName(item) {
    return item.categoria?.nombre || categories.find((category) => category.idCategoria === item.idCategoria)?.nombre || '-'
  }

  function getProviderName(item) {
    return item.proveedor?.nombre || providers.find((provider) => provider.idProveedor === item.idProveedor)?.nombre || '-'
  }

  function getSaleItemProduct(idProducto) {
    return products.find((item) => item.idProducto === Number(idProducto))
  }

  function getSaleItemSubtotal(item) {
    const product = getSaleItemProduct(item.idProducto)
    return product ? Number(product.precioVenta) * Number(item.cantidad || 0) : 0
  }

  function buildInitialSaleItems(list) {
    if (!list.length) return []
    return [{ idProducto: list[0].idProducto, cantidad: 1 }]
  }

  function resetProductModal() {
    setProductModal({ open: false, mode: 'create', data: emptyProduct, id: null })
  }

  function resetCategoryModal() {
    setCategoryModal({ open: false, mode: 'create', data: emptyCategory, id: null })
  }

  function resetProviderModal() {
    setProviderModal({ open: false, mode: 'create', data: emptyProvider, id: null })
  }

  function openProductModal(product = null) {
    setProductModal({
      open: true,
      mode: product ? 'edit' : 'create',
      id: product?.idProducto || null,
      data: product ? {
        codigo: product.codigo || '',
        nombre: product.nombre || '',
        idCategoria: String(product.idCategoria || ''),
        idProveedor: String(product.idProveedor || ''),
        precioCompra: product.precioCompra ?? '',
        precioVenta: product.precioVenta ?? '',
        stock: product.stock ?? '',
        stockMinimo: product.stockMinimo ?? '',
        fechaVencimiento: product.fechaVencimiento?.slice(0, 10) || '',
      } : emptyProduct,
    })
  }

  function openCategoryModal(category = null) {
    setCategoryModal({ open: true, mode: category ? 'edit' : 'create', id: category?.idCategoria || null, data: { nombre: category?.nombre || '' } })
  }

  function openProviderModal(provider = null) {
    setProviderModal({
      open: true,
      mode: provider ? 'edit' : 'create',
      id: provider?.idProveedor || null,
      data: {
        nombre: provider?.nombre || '',
        telefono: provider?.telefono || '',
        email: provider?.email || '',
        direccion: provider?.direccion || '',
      },
    })
  }

  async function submitProduct(event) {
    event.preventDefault()
    setSaving(true)
    try {
      const payload = {
        codigo: productModal.data.codigo.trim() || null,
        nombre: productModal.data.nombre.trim(),
        idCategoria: Number(productModal.data.idCategoria),
        idProveedor: Number(productModal.data.idProveedor),
        precioCompra: productModal.data.precioCompra === '' ? null : Number(productModal.data.precioCompra),
        precioVenta: Number(productModal.data.precioVenta),
        stock: Number(productModal.data.stock),
        stockMinimo: productModal.data.stockMinimo === '' ? null : Number(productModal.data.stockMinimo),
        fechaVencimiento: productModal.data.fechaVencimiento,
      }

      if (productModal.mode === 'edit') {
        await service.updateProduct(productModal.id, payload)
        showMessage('Producto actualizado correctamente.')
      } else {
        await service.createProduct(payload)
        showMessage('Producto creado correctamente.')
      }

      resetProductModal()
      await loadAll()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function submitCategory(event) {
    event.preventDefault()
    setSaving(true)
    try {
      const payload = { nombre: categoryModal.data.nombre.trim() }
      if (categoryModal.mode === 'edit') {
        await service.updateCategory(categoryModal.id, payload)
        showMessage('Categoria actualizada correctamente.')
      } else {
        await service.createCategory(payload)
        showMessage('Categoria creada correctamente.')
      }

      resetCategoryModal()
      await loadAll()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function submitProvider(event) {
    event.preventDefault()
    setSaving(true)
    try {
      const payload = {
        nombre: providerModal.data.nombre.trim(),
        telefono: providerModal.data.telefono.trim() || null,
        email: providerModal.data.email.trim() || null,
        direccion: providerModal.data.direccion.trim() || null,
      }
      if (providerModal.mode === 'edit') {
        await service.updateProvider(providerModal.id, payload)
        showMessage('Proveedor actualizado correctamente.')
      } else {
        await service.createProvider(payload)
        showMessage('Proveedor creado correctamente.')
      }

      resetProviderModal()
      await loadAll()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function removeEntity(action, successMessage) {
    if (!window.confirm('Confirma esta accion.')) return
    setSaving(true)
    try {
      await action()
      showMessage(successMessage)
      await loadAll()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function submitSale() {
    if (!saleItems.length) {
      setError('Agrega al menos una linea a la venta.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        productos: saleItems.map((item) => ({ idProducto: Number(item.idProducto), cantidad: Number(item.cantidad) })),
      }
      const receipt = await service.registerSale(payload)
      setLastReceipt(receipt)
      showMessage('Venta registrada correctamente.')
      await loadAll()
      setSaleItems(buildInitialSaleItems(products))
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function saveApiBase(event) {
    event.preventDefault()
    const value = draftApiBase.trim().replace(/\/$/, '')
    setStoredApiBase(value)
    setApiBase(value)
    setApiModalOpen(false)
    await loadAll()
  }

  function renderView() {
    switch (view) {
      case 'productos':
        return (
          <ProductosPage
            categories={categories}
            providers={providers}
            products={filteredProducts}
            productFilter={productFilter}
            setProductFilter={setProductFilter}
            onCreate={() => openProductModal()}
            onEdit={openProductModal}
            onDelete={(id) => removeEntity(() => service.deleteProduct(id), 'Producto eliminado correctamente.')}
            getCategoryName={getCategoryName}
            getProviderName={getProviderName}
          />
        )
      case 'categorias':
        return (
          <CategoriasPage
            categories={categories}
            onCreate={() => openCategoryModal()}
            onEdit={openCategoryModal}
            onDelete={(id) => removeEntity(() => service.deleteCategory(id), 'Categoria eliminada correctamente.')}
          />
        )
      case 'proveedores':
        return (
          <ProveedoresPage
            providers={providers}
            onCreate={() => openProviderModal()}
            onEdit={openProviderModal}
            onDelete={(id) => removeEntity(() => service.deleteProvider(id), 'Proveedor eliminado correctamente.')}
          />
        )
      case 'ventas':
        return (
          <VentasPage
            products={products}
            sales={sales}
            saleItems={saleItems}
            setSaleItems={setSaleItems}
            saving={saving}
            saleTotal={saleTotal}
            lastReceipt={lastReceipt}
            onSubmitSale={() => void submitSale()}
          />
        )
      case 'alertas':
        return <AlertasPage alerts={alerts} alertDays={alertDays} setAlertDays={setAlertDays} />
      default:
        return (
          <DashboardPage
            products={products}
            categories={categories}
            alerts={alerts}
            sales={sales}
            lowStockCount={lowStockCount}
            todaySales={todaySales}
            todaySalesTotal={todaySalesTotal}
            onRefresh={() => void loadAll()}
            onNavigate={setView}
          />
        )
    }
  }

  return (
    <div className="app-shell d-flex">
      <Sidebar
        view={view}
        setView={setView}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
        counts={{ products: products.length, categories: categories.length, providers: providers.length, alerts: alerts.length }}
        apiBase={apiBase}
        onConfigureApi={() => setApiModalOpen(true)}
      />

      <div className="content-area flex-grow-1 min-vh-100">
        <Topbar apiBase={apiBase} onOpenMenu={() => setMobileMenu(true)} onConfigureApi={() => setApiModalOpen(true)} />

        <main className="container-fluid px-3 px-lg-4 py-4">
          {message ? <div className="alert alert-success">{message}</div> : null}
          {error ? <div className="alert alert-danger">{error}</div> : null}
          {loading ? <div className="alert alert-info">Cargando informacion del sistema...</div> : renderView()}
        </main>
      </div>

      <ProductModal
        open={productModal.open}
        productModal={productModal}
        categories={categories}
        providers={providers}
        saving={saving}
        onClose={resetProductModal}
        setProductModal={setProductModal}
        onSubmit={submitProduct}
      />

      <CategoryModal
        open={categoryModal.open}
        categoryModal={categoryModal}
        saving={saving}
        onClose={resetCategoryModal}
        setCategoryModal={setCategoryModal}
        onSubmit={submitCategory}
      />

      <ProviderModal
        open={providerModal.open}
        providerModal={providerModal}
        saving={saving}
        onClose={resetProviderModal}
        setProviderModal={setProviderModal}
        onSubmit={submitProvider}
      />

      <ApiConfigModal
        open={apiModalOpen}
        draftApiBase={draftApiBase}
        setDraftApiBase={setDraftApiBase}
        loading={loading}
        onClose={() => setApiModalOpen(false)}
        onSubmit={(event) => void saveApiBase(event)}
      />
    </div>
  )
}

export default App
