import AlertCard from '../components/common/AlertCard'
import EmptyState from '../components/common/EmptyState'
import SectionHeader from '../components/common/SectionHeader'
import StatCard from '../components/common/StatCard'
import TableWrapper from '../components/common/TableWrapper'
import { formatDate, formatMoney } from '../api'

function DashboardPage({ products, categories, alerts, sales, lowStockCount, todaySales, todaySalesTotal, onRefresh, onNavigate }) {
  return (
    <>
      <SectionHeader
        title="Resumen general"
        subtitle="Vista consolidada del inventario, las ventas y las alertas de vencimiento."
        
      />

      <div className="row g-4 mb-4">
        <StatCard title="Productos activos" value={products.length} hint="medicamentos disponibles" />
        <StatCard title="Categorias" value={categories.length} hint="clasificaciones vigentes" />
        <StatCard title="Stock bajo" value={lowStockCount} hint="por debajo del minimo" tone="warning" />
        <StatCard title="Alertas" value={alerts.length} hint="productos proximos a vencer" tone="danger" />
        <StatCard title="Ventas de hoy" value={todaySales.length} hint={formatMoney(todaySalesTotal)} tone="success" />
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-6">
          <div className="section-card card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">Alertas prioritarias</h5>
                <small className="text-secondary">Los productos mas cercanos a vencer.</small>
              </div>
              <button className="btn btn-sm btn-outline-success" onClick={() => onNavigate('alertas')}>Ver alertas</button>
            </div>
            <div className="card-body">
              {alerts.length === 0 ? <EmptyState title="Sin alertas actuales" description="No hay medicamentos proximos a vencer en el rango consultado." /> : (
                <div className="d-grid gap-3">
                  {alerts.slice(0, 5).map((alert) => <AlertCard key={alert.idProducto} alert={alert} />)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-6">
          <div className="section-card card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">Ultimas ventas</h5>
                <small className="text-secondary">Historial reciente del punto de venta.</small>
              </div>
              <button className="btn btn-sm btn-outline-success" onClick={() => onNavigate('ventas')}>Ir a ventas</button>
            </div>
            <div className="card-body p-0">
              <TableWrapper>
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Comprobante</th>
                      <th>Fecha</th>
                      <th>Items</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.length === 0 ? (
                      <tr><td colSpan="4"><EmptyState title="Aun no hay ventas" description="Registra tu primera venta para verla reflejada aqui." compact /></td></tr>
                    ) : sales.slice(0, 5).map((sale) => (
                      <tr key={sale.idVenta}>
                        <td className="fw-semibold">#{sale.idVenta}</td>
                        <td>{formatDate(sale.fecha, true)}</td>
                        <td>{sale.detalle.length}</td>
                        <td>{formatMoney(sale.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrapper>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardPage
