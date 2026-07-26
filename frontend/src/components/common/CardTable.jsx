import TableWrapper from './TableWrapper'

function CardTable({ title, subtitle, children }) {
  return (
    <div className="section-card card">
      {title ? (
        <div className="card-header">
          <h5 className="mb-1">{title}</h5>
          {subtitle ? <small className="text-secondary">{subtitle}</small> : null}
        </div>
      ) : null}
      <div className="card-body p-0">
        <TableWrapper>{children}</TableWrapper>
      </div>
    </div>
  )
}

export default CardTable
