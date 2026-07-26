function ModalActions({ saving, onCancel, submitLabel }) {
  return (
    <div className="col-12 d-flex justify-content-end gap-2 pt-2">
      <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>
      <button type="submit" className="btn btn-success" disabled={saving}>{saving ? 'Guardando...' : submitLabel}</button>
    </div>
  )
}

export default ModalActions
