import CardTable from '../components/common/CardTable'
import EmptyState from '../components/common/EmptyState'
import SectionHeader from '../components/common/SectionHeader'
import { formatDate, formatMoney } from '../api'

function VentasPage({ products, sales, saleItems, setSaleItems, saving, saleTotal, lastReceipt, onSubmitSale }) {
  function updateSaleLine(index, field, value) {
    setSaleItems((current) => current.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: Number(value) } : item
    )))
  }

  function removeSaleLine(index) {
    setSaleItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  function addSaleLine() {
    if (!products.length) return
    setSaleItems((current) => [...current, { idProducto: products[0].idProducto, cantidad: 1 }])
  }

  function getProduct(idProducto) {
    return products.find((item) => item.idProducto === Number(idProducto))
  }

  function getSubtotal(item) {
    const product = getProduct(item.idProducto)
    return product ? Number(product.precioVenta) * Number(item.cantidad || 0) : 0
  }

  return (
    <>
      <SectionHeader
        title="Ventas"
        subtitle="Registra ventas y consulta el historial de comprobantes."
        actions={<button className="btn btn-outline-success" onClick={addSaleLine}>Agregar linea</button>}
      />

      <div className="row g-4">
        <div className="col-12 col-xl-7">
          <div className="section-card card h-100">
            <div className="card-header">
              <h5 className="mb-1">Nueva venta</h5>
              <small className="text-secondary">Selecciona uno o varios medicamentos y define las cantidades.</small>
            </div>
            <div className="card-body d-grid gap-3">
              {saleItems.length === 0 ? <EmptyState title="Sin lineas de venta" description="Agrega una linea para comenzar la transaccion." compact /> : saleItems.map((item, index) => {
                const product = getProduct(item.idProducto)
                return (
                  <div className="row g-2 align-items-center border rounded-4 p-3" key={`${item.idProducto}-${index}`}>
                    <div className="col-12 col-lg-7">
                      <label className="form-label small text-secondary">Producto</label>
                      <select className="form-select" value={item.idProducto} onChange={(event) => updateSaleLine(index, 'idProducto', event.target.value)}>
                        {products.map((productOption) => (
                          <option key={productOption.idProducto} value={productOption.idProducto}>
                            {productOption.codigo} - {productOption.nombre} (stock {productOption.stock})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6 col-lg-2">
                      <label className="form-label small text-secondary">Cantidad</label>
                      <input className="form-control" type="number" min="1" value={item.cantidad} onChange={(event) => updateSaleLine(index, 'cantidad', event.target.value)} />
                    </div>
                    <div className="col-6 col-lg-2">
                      <label className="form-label small text-secondary">Subtotal</label>
                      <div className="form-control bg-light">{formatMoney(getSubtotal(item))}</div>
                    </div>
                    <div className="col-12 col-lg-1 d-flex justify-content-end align-self-end">
                      <button className="btn btn-outline-danger btn-sm" onClick={() => removeSaleLine(index)} disabled={saleItems.length === 1}>Quitar</button>
                    </div>
                    {product ? <div className="col-12"><small className="text-secondary">Disponible: {product.stock} unidades | Precio: {formatMoney(product.precioVenta)}</small></div> : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-5">
          <div className="section-card card summary-surface h-100">
            <div className="card-body d-flex flex-column gap-3">
              <div>
                <h5 className="mb-1">Comprobante</h5>
                <p className="mb-0 text-white-50">Resumen previo antes de confirmar la venta.</p>
              </div>
              <div className="d-flex justify-content-between align-items-center border-top border-light border-opacity-25 pt-3">
                <span>Articulos</span>
                <strong>{saleItems.reduce((sum, item) => sum + Number(item.cantidad || 0), 0)}</strong>
              </div>
              <div className="display-6 fw-bold">{formatMoney(saleTotal)}</div>
              <button className="btn btn-success" onClick={onSubmitSale} disabled={saving || !saleItems.length}>{saving ? 'Procesando...' : 'Registrar venta'}</button>
              {lastReceipt ? (
                <div className="receipt-box p-3 mt-2">
                  <div className="fw-semibold mb-2">Ultimo comprobante #{lastReceipt.idVenta}</div>
                  <div className="small text-secondary mb-2">{formatDate(lastReceipt.fecha, true)}</div>
                  <ul className="list-unstyled mb-2">
                    {lastReceipt.detalle.map((detail, index) => (
                      <li className="d-flex justify-content-between gap-3" key={`${detail.idProducto}-${index}`}>
                        <span>{detail.nombreProducto} x{detail.cantidad}</span>
                        <strong>{formatMoney(detail.subTotal)}</strong>
                      </li>
                    ))}
                  </ul>
                  <div className="d-flex justify-content-between border-top pt-2 fw-semibold">
                    <span>Total</span>
                    <span>{formatMoney(lastReceipt.total)}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <CardTable title="Historial de ventas" subtitle="Comprobantes registrados en el sistema.">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Comprobante</th>
                <th>Fecha</th>
                <th>Detalle</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr><td colSpan="4"><EmptyState title="Sin ventas registradas" description="Cuando registres transacciones apareceran aqui." compact /></td></tr>
              ) : sales.map((sale) => (
                <tr key={sale.idVenta}>
                  <td className="fw-semibold">#{sale.idVenta}</td>
                  <td>{formatDate(sale.fecha, true)}</td>
                  <td>
                    <div className="d-grid gap-1">
                      {sale.detalle.map((detail, index) => (
                        <small key={`${detail.idProducto}-${index}`}>{detail.nombreProducto} x{detail.cantidad}</small>
                      ))}
                    </div>
                  </td>
                  <td>{formatMoney(sale.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardTable>
      </div>
    </>
  )
}

export default VentasPage
