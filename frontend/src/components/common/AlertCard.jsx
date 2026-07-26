import { formatDate } from '../../api'

function AlertCard({ alert, detailed = false }) {
  const toneClass = alert.diasParaVencer <= 7 ? 'badge-danger-soft' : 'badge-warn-soft'

  return (
    <div className="alert-item p-3 bg-white">
      <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge rounded-pill text-bg-light border">{alert.codigo}</span>
            <span className={`badge rounded-pill ${toneClass}`}>{alert.diasParaVencer} dias</span>
          </div>
          <div className="fw-semibold">{alert.nombreProducto}</div>
          <div className="text-secondary small">Vence el {formatDate(alert.fechaVencimiento)} | Stock disponible: {alert.stock}</div>
        </div>
        {detailed ? <div className="text-secondary small">ID producto: {alert.idProducto}</div> : null}
      </div>
    </div>
  )
}

export default AlertCard
