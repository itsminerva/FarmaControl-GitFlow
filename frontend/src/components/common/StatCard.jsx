function StatCard({ title, value, hint, tone }) {
  const toneClass = tone === 'danger' ? 'text-danger' : tone === 'warning' ? 'text-warning' : tone === 'success' ? 'text-success' : 'text-primary'
  const accentClass = tone === 'danger' ? 'accent-danger' : tone === 'warning' ? 'accent-warning' : tone === 'success' ? 'accent-success' : 'accent-primary'

  return (
    <div className="col-12 col-md-6 col-xl">
      <div className={`stat-card stat-card-sb ${accentClass}`}>
        <div className="d-flex align-items-center justify-content-between gap-3">
          <div>
            <div className="text-uppercase small text-secondary fw-semibold mb-2">{title}</div>
            <div className={`stat-value ${toneClass}`}>{value}</div>
            <div className="text-secondary small">{hint}</div>
          </div>
          <div className="stat-icon">◎</div>
        </div>
      </div>
    </div>
  )
}

export default StatCard
