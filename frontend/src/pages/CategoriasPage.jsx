import CardTable from '../components/common/CardTable'
import EmptyState from '../components/common/EmptyState'
import SectionHeader from '../components/common/SectionHeader'

function CategoriasPage({ categories, onCreate, onEdit, onDelete }) {
  return (
    <>
      <SectionHeader
        title="Categorias"
        subtitle="Catalogo de clasificaciones para los medicamentos."
        actions={<button className="btn btn-success" onClick={onCreate}>Nueva categoria</button>}
      />

      <CardTable>
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan="3"><EmptyState title="Sin categorias" description="Crea al menos una categoria para registrar productos." compact /></td></tr>
            ) : categories.map((item) => (
              <tr key={item.idCategoria}>
                <td className="fw-semibold">{item.nombre}</td>
                <td><span className="badge rounded-pill badge-soft">Activa</span></td>
                <td className="text-end">
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-success" onClick={() => onEdit(item)}>Editar</button>
                    <button className="btn btn-outline-danger" onClick={() => onDelete(item.idCategoria)}>Eliminar</button>
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

export default CategoriasPage
