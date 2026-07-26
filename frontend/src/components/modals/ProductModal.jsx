import FormInput from '../common/FormInput'
import FormNumber from '../common/FormNumber'
import Modal from '../common/Modal'
import ModalActions from '../common/ModalActions'

function ProductModal({ open, productModal, categories, providers, saving, onClose, setProductModal, onSubmit }) {
  return (
      <Modal open={open} title={productModal.mode === 'edit' ? 'Actualizar producto' : 'Nuevo producto'} onClose={onClose}>
      <form onSubmit={onSubmit} className="row g-3">
              <FormInput label="Codigo" value={productModal.data.codigo} onChange={(value) => setProductModal((current) => ({ ...current, data: { ...current.data, codigo: value } }))} help="Si no ingresas un código, el sistema lo generará automáticamente." />
        <div className="col-12">
          <label className="form-label">Nombre</label>
          <input className="form-control" value={productModal.data.nombre} onChange={(event) => setProductModal((current) => ({ ...current, data: { ...current.data, nombre: event.target.value } }))} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Categoria</label>
          <select className="form-select" value={productModal.data.idCategoria} onChange={(event) => setProductModal((current) => ({ ...current, data: { ...current.data, idCategoria: event.target.value } }))} required>
            <option value="">Selecciona una categoria</option>
            {categories.map((item) => <option key={item.idCategoria} value={item.idCategoria}>{item.nombre}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Proveedor</label>
          <select className="form-select" value={productModal.data.idProveedor} onChange={(event) => setProductModal((current) => ({ ...current, data: { ...current.data, idProveedor: event.target.value } }))} required>
            <option value="">Selecciona un proveedor</option>
            {providers.map((item) => <option key={item.idProveedor} value={item.idProveedor}>{item.nombre}</option>)}
          </select>
        </div>
        <FormNumber label="Precio compra" value={productModal.data.precioCompra} onChange={(value) => setProductModal((current) => ({ ...current, data: { ...current.data, precioCompra: value } }))} />
        <FormNumber label="Precio venta" value={productModal.data.precioVenta} onChange={(value) => setProductModal((current) => ({ ...current, data: { ...current.data, precioVenta: value } }))} required />
        <FormNumber label="Stock" value={productModal.data.stock} onChange={(value) => setProductModal((current) => ({ ...current, data: { ...current.data, stock: value } }))} required integer />
        <FormNumber label="Stock minimo" value={productModal.data.stockMinimo} onChange={(value) => setProductModal((current) => ({ ...current, data: { ...current.data, stockMinimo: value } }))} integer />
        <div className="col-md-6">
          <label className="form-label">Fecha de vencimiento</label>
          <input className="form-control" type="date" value={productModal.data.fechaVencimiento} onChange={(event) => setProductModal((current) => ({ ...current, data: { ...current.data, fechaVencimiento: event.target.value } }))} required />
        </div>
              <ModalActions saving={saving} onCancel={onClose} submitLabel={productModal.mode === 'edit' ? 'Actualizar producto' : 'Registrar producto'} />
      </form>
    </Modal>
  )
}

export default ProductModal
