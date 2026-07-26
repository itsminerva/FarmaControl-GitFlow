function EmptyState({ title, description, compact = false }) {
  return (
    <div className={`text-center text-secondary ${compact ? 'py-4' : 'py-5'}`}>
      <div className="fw-semibold text-dark mb-1">{title}</div>
      <div>{description}</div>
    </div>
  )
}

export default EmptyState
