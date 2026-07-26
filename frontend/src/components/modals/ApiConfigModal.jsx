import Modal from '../common/Modal'
import ModalActions from '../common/ModalActions'

function ApiConfigModal({ open, draftApiBase, setDraftApiBase, loading, onClose, onSubmit }) {
  return (
    <Modal open={open} title="Configuracion de la API" onClose={onClose}>
      <form onSubmit={onSubmit} className="row g-3">
        <div className="col-12">
          <label className="form-label">URL base</label>
          <input className="form-control" value={draftApiBase} onChange={(event) => setDraftApiBase(event.target.value)} required />
          <div className="form-text">Ejemplo: http://localhost:5121/api</div>
        </div>
        <ModalActions saving={loading} onCancel={onClose} submitLabel="Guardar y probar" />
      </form>
    </Modal>
  )
}

export default ApiConfigModal
