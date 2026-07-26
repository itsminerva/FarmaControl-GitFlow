import FormInput from '../common/FormInput'
import Modal from '../common/Modal'
import ModalActions from '../common/ModalActions'

function ProviderModal({ open, providerModal, saving, onClose, setProviderModal, onSubmit }) {
  return (
    <Modal open={open} title={providerModal.mode === 'edit' ? 'Editar proveedor' : 'Nuevo proveedor'} onClose={onClose}>
      <form onSubmit={onSubmit} className="row g-3">
        <div className="col-12">
          <label className="form-label">Nombre</label>
          <input className="form-control" value={providerModal.data.nombre} onChange={(event) => setProviderModal((current) => ({ ...current, data: { ...current.data, nombre: event.target.value } }))} required />
        </div>
        <FormInput label="Telefono" value={providerModal.data.telefono} onChange={(value) => setProviderModal((current) => ({ ...current, data: { ...current.data, telefono: value } }))} />
        <FormInput label="Email" value={providerModal.data.email} onChange={(value) => setProviderModal((current) => ({ ...current, data: { ...current.data, email: value } }))} type="email" />
        <div className="col-12">
          <label className="form-label">Direccion</label>
          <input className="form-control" value={providerModal.data.direccion} onChange={(event) => setProviderModal((current) => ({ ...current, data: { ...current.data, direccion: event.target.value } }))} />
        </div>
        <ModalActions saving={saving} onCancel={onClose} submitLabel={providerModal.mode === 'edit' ? 'Guardar cambios' : 'Crear proveedor'} />
      </form>
    </Modal>
  )
}

export default ProviderModal
