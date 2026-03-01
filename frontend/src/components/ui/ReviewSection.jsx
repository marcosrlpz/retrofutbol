import { useState, useCallback } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import api from "../../services/auth.service";

// ── Styled Components ─────────────────────────────────────────────
const Section = styled.section`
  margin-top: var(--spacing-3xl);
  border-top: 2px solid var(--color-primary);
  padding-top: var(--spacing-xl);
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-xl);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: var(--spacing-xl);
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

// ── Resumen de estrellas ──────────────────────────────────────────
const Summary = styled.div`
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  text-align: center;
`;

const BigRating = styled.p`
  font-size: 4rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.2rem;
  font-size: ${({ $size }) => $size || "1.2rem"};
`;

const RatingCount = styled.p`
  font-size: 0.82rem;
  color: var(--color-text-muted);
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  font-size: 0.78rem;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 6px;
  background: #f3f4f6;
  border-radius: 99px;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: #c9a84c;
  border-radius: 99px;
  transition: width 0.5s ease;
`;

// ── Formulario ────────────────────────────────────────────────────
const Form = styled.div`
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
`;

const FormHeader = styled.div`
  background: #111827;
  color: white;
  padding: 0.75rem var(--spacing-lg);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const FormBody = styled.div`
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const StarPicker = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const StarBtn = styled.button`
  font-size: 1.6rem;
  transition: transform 0.1s;
  &:hover { transform: scale(1.2); }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-family: var(--font-family);
  resize: vertical;
  color: var(--color-text);
  transition: var(--transition);
  &:focus { outline: none; border-color: var(--color-primary); }
  &::placeholder { color: var(--color-text-muted); }
`;

const SubmitBtn = styled.button`
  background: #111827;
  color: white;
  font-size: 0.88rem;
  font-weight: 700;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  transition: var(--transition);
  &:hover:not(:disabled) { background: var(--color-accent); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const LoginMsg = styled.div`
  padding: var(--spacing-lg);
  font-size: 0.85rem;
  color: var(--color-text-muted);
  text-align: center;
  a { color: var(--color-accent); font-weight: 700; }
`;

// ── Lista de reviews ──────────────────────────────────────────────
const ReviewsList = styled.div`
  margin-top: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const ReviewCard = styled.div`
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-sm);
`;

const ReviewUser = styled.div``;
const ReviewName = styled.p`font-size: 0.88rem; font-weight: 700;`;
const ReviewDate = styled.p`font-size: 0.72rem; color: var(--color-text-muted); margin-top: 0.1rem;`;
const ReviewComment = styled.p`font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.6; margin-top: var(--spacing-sm);`;

const DeleteBtn = styled.button`
  font-size: 0.72rem;
  color: var(--color-text-muted);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  transition: var(--transition);
  &:hover { color: var(--color-danger); border-color: var(--color-danger); }
`;

const Empty = styled.p`
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.88rem;
  padding: var(--spacing-xl);
`;

// ── Helper ────────────────────────────────────────────────────────
const renderStars = (rating, size) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <Stars $size={size}>
      {"★".repeat(full)}
      {half ? "½" : ""}
      <span style={{ opacity: 0.25 }}>{"★".repeat(empty)}</span>
    </Stars>
  );
};

// ── Componente principal ──────────────────────────────────────────
const ReviewSection = ({ productId, productRating }) => {
  const { isAuthenticated, user } = useAuth();
  const [rating, setRating]   = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(() =>
    api.get(`/reviews/${productId}`).then(r => r.data), [productId]);
  const { data, refetch } = useFetch(fetchReviews, [productId]);
  const reviews = data?.reviews || [];

  // Distribución de estrellas
  const dist = [5, 4, 3, 2, 1].map(s => ({
    stars: s,
    count: reviews.filter(r => r.rating === s).length,
    pct: reviews.length ? (reviews.filter(r => r.rating === s).length / reviews.length) * 100 : 0,
  }));

  const handleSubmit = async () => {
    if (!rating) return toast.error("Selecciona una valoración");
    if (!comment.trim()) return toast.error("Escribe un comentario");
    setSubmitting(true);
    try {
      await api.post(`/reviews/${productId}`, { rating, comment });
      toast.success("¡Gracias por tu valoración! ⭐");
      setRating(0);
      setComment("");
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al enviar valoración");
    }
    setSubmitting(false);
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("¿Eliminar esta valoración?")) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success("Valoración eliminada");
      refetch();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const alreadyReviewed = reviews.some(r => r.user?._id === user?._id);

  return (
    <Section>
      <SectionTitle>⭐ Valoraciones ({reviews.length})</SectionTitle>

      <TwoCol>
        {/* Resumen */}
        <Summary>
          <BigRating>{productRating?.toFixed(1) || "—"}</BigRating>
          {renderStars(productRating || 0, "1.5rem")}
          <RatingCount>{reviews.length} valoración{reviews.length !== 1 ? "es" : ""}</RatingCount>
          <div style={{ width: "100%" }}>
            {dist.map(d => (
              <BarRow key={d.stars}>
                <span>{d.stars}★</span>
                <BarTrack><BarFill $pct={d.pct} /></BarTrack>
                <span style={{ width: "20px", textAlign: "right", color: "var(--color-text-muted)" }}>{d.count}</span>
              </BarRow>
            ))}
          </div>
        </Summary>

        {/* Formulario */}
        <Form>
          <FormHeader>✍️ Deja tu valoración</FormHeader>
          {!isAuthenticated ? (
            <LoginMsg>
              <a href="/login">Inicia sesión</a> para dejar una valoración.<br />
              Solo los compradores verificados pueden valorar.
            </LoginMsg>
          ) : alreadyReviewed ? (
            <LoginMsg>✅ Ya has valorado este producto. ¡Gracias!</LoginMsg>
          ) : (
            <FormBody>
              <div>
                <p style={{ fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-muted)" }}>
                  Tu valoración *
                </p>
                <StarPicker>
                  {[1, 2, 3, 4, 5].map(s => (
                    <StarBtn
                      key={s}
                      type="button"
                      onMouseEnter={() => setHovered(s)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(s)}
                    >
                      {s <= (hovered || rating) ? "⭐" : "☆"}
                    </StarBtn>
                  ))}
                </StarPicker>
              </div>
              <div>
                <p style={{ fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-muted)" }}>
                  Tu comentario *
                </p>
                <Textarea
                  placeholder="Cuéntanos qué te pareció esta camiseta..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  maxLength={500}
                />
                <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", textAlign: "right", marginTop: "0.2rem" }}>
                  {comment.length}/500
                </p>
              </div>
              <SubmitBtn onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Enviando..." : "Enviar valoración ⭐"}
              </SubmitBtn>
              <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
                Solo puedes valorar productos que hayas comprado y recibido.
              </p>
            </FormBody>
          )}
        </Form>
      </TwoCol>

      {/* Lista de reviews */}
      {reviews.length === 0 ? (
        <Empty>Sé el primero en valorar esta camiseta ⭐</Empty>
      ) : (
        <ReviewsList>
          {reviews.map(r => (
            <ReviewCard key={r._id}>
              <ReviewHeader>
                <ReviewUser>
                  {renderStars(r.rating, "1rem")}
                  <ReviewName>{r.user?.name} {r.user?.lastname}</ReviewName>
                  <ReviewDate>{new Date(r.createdAt).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}</ReviewDate>
                </ReviewUser>
                {(user?._id === r.user?._id || user?.role === "admin") && (
                  <DeleteBtn onClick={() => handleDelete(r._id)}>🗑️ Eliminar</DeleteBtn>
                )}
              </ReviewHeader>
              <ReviewComment>"{r.comment}"</ReviewComment>
            </ReviewCard>
          ))}
        </ReviewsList>
      )}
    </Section>
  );
};

export default ReviewSection;