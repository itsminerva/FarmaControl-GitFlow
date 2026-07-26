import Modal from '../common/Modal'
import ModalActions from '../common/ModalActions'

function CategoryModal({ open, categoryModal, saving, onClose, setCategoryModal, onSubmit }) {
  return (
    <Modal open={open} title={categoryModal.mode === 'edit' ? 'Editar categoria' : 'Nueva categoria'} onClose={onClose}>
      <form onSubmit={onSubmit} className="row g-3">
        <div className="col-12">
          <label className="form-label">Nombre</label>
          <input className="form-control" value={categoryModal.data.nombre} onChange={(event) => setCategoryModal((current) => ({ ...current, data: { ...current.data, nombre: event.target.value } }))} required />
        </div>
        <ModalActions saving={saving} onCancel={onClose} submitLabel={categoryModal.mode === 'edit' ? 'Guardar cambios' : 'Crear categoria'} />
      </form>
    </Modal>
  )
}

export default CategoryModal
