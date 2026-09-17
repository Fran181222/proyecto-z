"use client";
import { useState } from "react";
import { CircleCheck, Send, Star } from "lucide-react";

function StarRating({ rating, interactive = false, onSelect }) {
  const [hovered, setHovered] = useState(0);
  const activeRating = interactive ? hovered || rating : rating;

  return (
    <div style={{ display: "flex", gap: "0.2rem" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onSelect && onSelect(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          style={{
            background: "none",
            border: "none",
            cursor: interactive ? "pointer" : "default",
            padding: 0,
            color: star <= activeRating ? "var(--yellow)" : "var(--muted)",
            transition: "color 0.15s ease",
          }}
          aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
        >
          <Star size={24} fill={star <= activeRating ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ initialReviews = [] }) {
  const [reviews, setReviews] = useState(
    initialReviews.length > 0
      ? initialReviews
      : [
          {
            id: 1,
            name: "Laura M.",
            rating: 5,
            comment: "Hermosos, llegaron perfectos y el packaging es un regalo en si mismo.",
            date: "2025-05-10",
          },
          {
            id: 2,
            name: "Sofia R.",
            rating: 4,
            comment: "Muy buena calidad, los uso todos los dias y no pierden brillo.",
            date: "2025-04-28",
          },
        ],
  );

  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [submitted, setSubmitted] = useState(false);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) return;
    const newReview = {
      ...form,
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
    };
    setReviews((prev) => [newReview, ...prev]);
    setForm({ name: "", rating: 5, comment: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="review-section mt-5 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <p className="section-tag mb-1">Resenas del producto</p>
          <h3 style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Lo que dicen nuestras clientas
          </h3>
        </div>
        {reviews.length > 0 && (
          <div
            style={{
              background: "var(--surface)",
              borderRadius: "var(--radius-lg)",
              padding: "1rem 1.5rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--gold)" }}>
              {avgRating}
            </div>
            <StarRating rating={Math.round(avgRating)} />
            <div style={{ fontSize: "0.78rem", opacity: 0.6, marginTop: "0.25rem" }}>
              {reviews.length} resena{reviews.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>

      <div className="reviews-list d-flex flex-column gap-3 mb-5">
        {reviews.map((r) => (
          <article
            key={r.id}
            style={{
              background: "var(--surface)",
              borderRadius: "var(--radius-lg)",
              padding: "1.25rem 1.5rem",
            }}
          >
            <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
              <div>
                <strong style={{ fontSize: "0.95rem" }}>{r.name}</strong>
                <StarRating rating={r.rating} />
              </div>
              <time style={{ fontSize: "0.78rem", opacity: 0.5, whiteSpace: "nowrap" }}>
                {r.date}
              </time>
            </div>
            <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.6 }}>{r.comment}</p>
          </article>
        ))}
      </div>

      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
        }}
      >
        <h4 className="mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
          Deja tu opinion
        </h4>

        {submitted && (
          <div
            className="review-success-message mb-3"
            style={{
              background: "var(--gold)",
              color: "white",
              borderRadius: "var(--radius-sm)",
              padding: "0.75rem 1rem",
              fontSize: "0.88rem",
            }}
          >
            <CircleCheck size={18} /> Gracias por tu resena! Ya aparece publicada.
          </div>
        )}

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label">Tu nombre</label>
            <input
              className="form-control"
              type="text"
              placeholder="Como te llamas?"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Puntuacion</label>
            <div className="mt-1">
              <StarRating
                rating={form.rating}
                interactive
                onSelect={(star) => setForm({ ...form, rating: star })}
              />
            </div>
          </div>

          <div className="col-12">
            <label className="form-label">Tu comentario</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Que te parecio el producto? Lo recomendarias?"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              required
            />
          </div>

          <div className="col-12">
            <button className="btn-mali btn-gold" type="submit">
              <Send size={18} />Publicar resena
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
