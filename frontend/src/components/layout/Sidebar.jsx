import { views } from '../../constants/views'

const iconByView = {
  dashboard: 'bi-speedometer2',
  productos: 'bi-capsule-pill',
  categorias: 'bi-tags',
  proveedores: 'bi-truck',
  ventas: 'bi-receipt',
  alertas: 'bi-bell',
}

function Sidebar({ view, setView, mobileMenu, setMobileMenu, counts, apiBase, onConfigureApi }) {
  const content = (
    <div className="sidebar d-flex flex-column p-0">
      <div className="sidebar-brand px-4 py-4 border-bottom border-white border-opacity-10">
        <div className="small text-uppercase text-white-50 mb-2">Grupo 3</div>
        <h4 className="mb-1 text-white">FarmaControl</h4>
        <div className="sidebar-subtitle">Dashboard administrativo</div>
      </div>

      <nav className="nav flex-column px-3 py-4 mb-4">
        {views.map((item) => (
          <button
            key={item.key}
            className={`nav-link text-start border-0 bg-transparent ${view === item.key ? 'active' : ''}`}
            onClick={() => {
              setView(item.key)
              setMobileMenu(false)
            }}
          >
            <div className="d-flex justify-content-between align-items-center w-100 gap-2">
              <span className="d-flex align-items-center gap-2">
                <i className={`bi ${iconByView[item.key] || 'bi-circle'} nav-icon`} aria-hidden="true" />
                <span>{item.label}</span>
              </span>
            </div>
          </button>
        ))}
      </nav>


    </div>
  )

  return (
    <>
      {content}
      <div className={`offcanvas offcanvas-start ${mobileMenu ? 'show' : ''}`} tabIndex="-1" style={{ visibility: mobileMenu ? 'visible' : 'hidden' }}>
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title">FarmaControl</h5>
          <button type="button" className="btn-close" onClick={() => setMobileMenu(false)} />
        </div>
        <div className="offcanvas-body p-0">{content}</div>
      </div>
      {mobileMenu ? <div className="offcanvas-backdrop fade show" onClick={() => setMobileMenu(false)} /> : null}
    </>
  )
}

export default Sidebar
