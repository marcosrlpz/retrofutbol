import styled from "styled-components";
import { useCart } from "../../context/CartContext";

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  position: relative;
`;

const Img = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: var(--radius-md);
  background: #f5f0e8;
  flex-shrink: 0;
`;

const Info = styled.div`flex: 1; min-width: 0;`;
const Brand = styled.p`font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-text-muted);`;
const Name = styled.p`font-size: 0.95rem; font-weight: 700; color: var(--color-text); margin: 0.1rem 0;`;
const Temp = styled.p`font-size: 0.78rem; color: var(--color-text-muted);`;

// ── Personalización ──────────────────────────────────────────
const CustomBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.4rem;
`;

const CustomBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: #111827;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-full);
  letter-spacing: 0.03em;
`;

const Price = styled.p`font-size: 1rem; font-weight: 800; margin-top: 0.4rem;`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-sm);
  flex-shrink: 0;
`;

const QtyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
`;

const QtyBtn = styled.button`
  width: 32px; height: 32px;
  font-size: 1rem; font-weight: 700;
  color: var(--color-text);
  transition: var(--transition);
  &:hover { background: var(--color-bg-secondary); }
`;

const QtyNum = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  min-width: 24px;
  text-align: center;
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 24px; height: 24px;
  border-radius: 50%;
  background: var(--color-bg-secondary);
  color: var(--color-text-muted);
  font-size: 0.75rem;
  display: flex; align-items: center; justify-content: center;
  transition: var(--transition);
  &:hover { background: var(--color-danger); color: white; }
`;

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity, customization, key } = item;

  // Precio unitario con personalización
  const unitPrice = product.price + ((customization?.name || customization?.number) ? 5 : 0);

  return (
    <Row>
      <Img src={product.image_url || "/camisretro.jpg"} alt={product.name} />
      <Info>
        <Brand>{product.brand}</Brand>
        <Name>{product.name}</Name>
        {product.temporada && <Temp>Temporada {product.temporada}</Temp>}

        {/* ── Personalización ── */}
        {customization && (
          <CustomBadges>
            {customization.size && (
              <CustomBadge>📏 {customization.size}</CustomBadge>
            )}
            {customization.name && (
              <CustomBadge>👤 {customization.name}</CustomBadge>
            )}
            {customization.number && (
              <CustomBadge>🔢 #{customization.number}</CustomBadge>
            )}
            {customization.patch && customization.patch !== "Sin parches" && (
              <CustomBadge>🏆 {customization.patch}</CustomBadge>
            )}
          </CustomBadges>
        )}

        <Price>
          {(unitPrice * quantity).toFixed(2)} €
          {(customization?.name || customization?.number) && (
            <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", fontWeight: 500, marginLeft: "0.4rem" }}>
              (incl. personalización +5€)
            </span>
          )}
        </Price>
      </Info>

      <Controls>
        <QtyRow>
          <QtyBtn onClick={() => updateQuantity(key, quantity - 1)}>−</QtyBtn>
          <QtyNum>{quantity}</QtyNum>
          <QtyBtn onClick={() => updateQuantity(key, quantity + 1)}>+</QtyBtn>
        </QtyRow>
      </Controls>

      <RemoveBtn onClick={() => removeItem(key)} title="Eliminar">✕</RemoveBtn>
    </Row>
  );
};

export default CartItem;