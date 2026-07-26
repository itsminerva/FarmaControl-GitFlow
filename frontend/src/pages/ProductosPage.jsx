import CardTable from '../components/common/CardTable'
import EmptyState from '../components/common/EmptyState'
import SectionHeader from '../components/common/SectionHeader'
import { daysUntil, formatDate, formatMoney } from '../api'

function ProductosPage({ categories, providers, products, productFilter, setProductFilter, onCreate, onEdit, onDelete, getCategoryName, getProviderName }) {
  return (
    <>
      <SectionHeader
        title="Gestión de Productos"
        subtitle="Administración y consulta del inventario de medicamentos."
        actions={(
          <div className="d-flex gap-2 flex-wrap">
            <input
              className="form-control"
              style={{ minWidth: 240 }}
              placeholder="Buscar por nombre o codigo"
              value={productFilter}
              onChange={(event) => setProductFilter(event.target.value)}
            />
            <button className="btn btn-success" onClick={onCreate} disabled={!categories.length || !providers.length}>Nuevo producto</button>
          </div>
        )}
      />

      <CardTable>
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Nombre del producto</th>
              <th>Categoria</th>
              <th>Proveedor</th>
              <th>Precio venta</th>
              <th>Stock</th>
              <th>Vencimiento</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="8"><EmptyState title="Sin productos" description="Registra medicamentos para comenzar a operar el inventario." compact /></td></tr>
            ) : products.map((item) => {
              const remainingDays = daysUntil(item.fechaVencimiento)
              const lowStock = item.stock <= item.stockMinimo
              return (
                <tr key={item.idProducto}>
                  <td><span className="badge rounded-pill text-bg-light border">{item.codigo}</span></td>
                  <td>
                    <div className="fw-semibold">{item.nombre}</div>
                    <small className="text-secondary">Compra: {formatMoney(item.precioCompra)}</small>
                  </td>
                  <td>{getCategoryName(item)}</td>
                  <td>{getProviderName(item)}</td>
                  <td>{formatMoney(item.precioVenta)}</td>
                  <td><span className={`badge rounded-pill ${lowStock ? 'badge-danger-soft' : 'badge-soft'}`}>{item.stock}</span></td>
                  <td>
                    <div>{formatDate(item.fechaVencimiento)}</div>
                    <small className="text-secondary">{remainingDays} dias</small>
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-success" onClick={() => onEdit(item)}>Editar</button>
                      <button className="btn btn-outline-danger" onClick={() => onDelete(item.idProducto)}>Eliminar producto</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </CardTable>
    </>
  )
}

export default ProductosPage
