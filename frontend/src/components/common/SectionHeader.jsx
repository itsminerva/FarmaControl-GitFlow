function SectionHeader({ title, subtitle, actions }) {
  return (
    <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-4">
      <div>
        <h2 className="mb-1">{title}</h2>
        <p className="text-secondary mb-0">{subtitle}</p>
      </div>
      <div>{actions}</div>
    </div>
  )
}

export default SectionHeader
