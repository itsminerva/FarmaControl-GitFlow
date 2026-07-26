function FormInput({ label, value, onChange, help, type = 'text' }) {
  return (
    <div className="col-md-6">
      <label className="form-label">{label}</label>
      <input className="form-control" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
      {help ? <div className="form-text">{help}</div> : null}
    </div>
  )
}

export default FormInput
