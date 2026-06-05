export const metadata = {
  title: "Malibu Joyeria - Panel admin",
  description: "Panel administrativo de Malibu Joyeria.",
};

export default function AdminPage() {
  return (
    <main className="admin-body">
      <section className="admin-shell">
        <div className="container">
          <div className="admin-hero">
            <div className="admin-intro admin-section-card">
              <p className="section-tag">
                <i className="bi bi-shield-lock me-2"></i>Panel admin
              </p>
              <h1 className="section-title text-white">Gestion interna</h1>
              <p className="section-copy admin-intro-copy">
                Acceso reservado para administrar productos, pedidos y datos de
                la tienda.
              </p>
              <div className="admin-metrics">
                <div className="admin-metric">
                  <strong>24</strong>
                  <span>Productos</span>
                </div>
                <div className="admin-metric">
                  <strong>8</strong>
                  <span>Pedidos</span>
                </div>
                <div className="admin-metric">
                  <strong>3</strong>
                  <span>Colecciones</span>
                </div>
              </div>
            </div>

            <div className="admin-login-card">
              <p className="mini-label mb-2">Acceso</p>
              <h2 className="h4 mb-3">Panel en preparacion</h2>
              <p className="form-note mb-0">
                Esta seccion ya renderiza correctamente y queda lista para
                conectar el login o dashboard real.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
