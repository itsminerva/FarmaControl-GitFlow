function FormNumber({ label, value, onChange, required = false, integer = false }) {
  return (
    <div className="col-md-6">
      <label className="form-label">{label}</label>
      <input
        className="form-control"
        type="number"
        step={integer ? '1' : '0.01'}
        min="0"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </div>
  )
}

export default FormNumber
