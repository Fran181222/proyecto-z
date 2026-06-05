export const metadata = {
  title: "Malibu Joyeria - Gift Cards",
  description: "Regala credito para elegir piezas de Malibu Joyeria.",
};

export default function GiftCardPage() {
  return (
    <main className="page-shell">
      <section className="section-space">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-6">
              <p className="section-tag">
                <i className="bi bi-gift me-2"></i>Gift cards
              </p>
              <h1 className="section-title">Un regalo para elegir con calma</h1>
              <p className="section-copy">
                Tarjetas digitales para cumpleanos, aniversarios y pequenos
                gestos que brillan.
              </p>
            </div>
            <div className="col-12 col-lg-6">
              <div className="info-card p-4">
                <span className="mini-label">Disponible pronto</span>
                <h2 className="h4 mt-2">Gift Card Malibu</h2>
                <p className="mb-0">
                  Esta pagina ya queda lista para conectar montos, dedicatoria
                  y checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
