import Link from "next/link";
import { sets } from "@/data/products";

export const metadata = {
  title: "Malibu Joyeria - Sets",
  description: "Colecciones y sets de Malibu Joyeria.",
};

export default function SetsPage() {
  return (
    <main className="page-shell">
      <section className="section-space">
        <div className="container">
          <p className="section-tag">
            <i className="fa-solid fa-layer-group me-2"></i>Sets
          </p>
          <h1 className="section-title">Looks para combinar</h1>
          <div className="sets-collection-grid mt-4">
            {sets.map((set) => (
              <Link className="sets-collection-card text-decoration-none" href={`/sets/${set.id}`} key={set.id}>
                <img src={set.image} alt={set.title} />
                <div className="sets-collection-body">
                  <h2 className="h4">{set.title}</h2>
                  <p>{set.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
