import AlertCard from '../components/common/AlertCard'
import EmptyState from '../components/common/EmptyState'
import SectionHeader from '../components/common/SectionHeader'

function AlertasPage({ alerts, alertDays, setAlertDays }) {
  return (
    <>
      <SectionHeader
        title="Alertas de vencimiento"
        subtitle="Productos activos con stock que vencen dentro del rango seleccionado."
        actions={(
          <select className="form-select" style={{ width: 220 }} value={alertDays} onChange={(event) => setAlertDays(Number(event.target.value))}>
            <option value="7">Proximos 7 dias</option>
            <option value="15">Proximos 15 dias</option>
            <option value="30">Proximos 30 dias</option>
            <option value="60">Proximos 60 dias</option>
            <option value="90">Proximos 90 dias</option>
          </select>
        )}
      />

      <div className="d-grid gap-3">
        {alerts.length === 0 ? <EmptyState title="Sin alertas para este rango" description="Amplia el rango de dias o revisa el inventario cuando agregues nuevos lotes." /> : alerts.map((alert) => <AlertCard key={alert.idProducto} alert={alert} detailed />)}
      </div>
    </>
  )
}

export default AlertasPage
