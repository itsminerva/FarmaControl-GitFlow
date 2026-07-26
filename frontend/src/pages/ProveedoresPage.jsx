import CardTable from '../components/common/CardTable'
import EmptyState from '../components/common/EmptyState'
import SectionHeader from '../components/common/SectionHeader'

function ProveedoresPage({ providers, onCreate, onEdit, onDelete }) {
  return (
    <>
      <SectionHeader
        title="Proveedores"
        subtitle="Gestion de suplidores y datos de contacto."
        actions={<button className="btn btn-success" onClick={onCreate}>Nuevo proveedor</button>}
      />

      <CardTable>
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Telefono</th>
              <th>Email</th>
              <th>Direccion</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {providers.length === 0 ? (
              <tr><td colSpan="5"><EmptyState title="Sin proveedores" description="Agrega proveedores antes de crear productos." compact /></td></tr>
            ) : providers.map((item) => (
              <tr key={item.idProveedor}>
                <td className="fw-semibold">{item.nombre}</td>
                <td>{item.telefono || '-'}</td>
                <td>{item.email || '-'}</td>
                <td>{item.direccion || '-'}</td>
                <td className="text-end">
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-success" onClick={() => onEdit(item)}>Editar</button>
                    <button className="btn btn-outline-danger" onClick={() => onDelete(item.idProveedor)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardTable>
    </>
  )
}

export default ProveedoresPage
