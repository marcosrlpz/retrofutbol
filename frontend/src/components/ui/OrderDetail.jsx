import styled from "styled-components";
import { Link } from "react-router-dom";

const Overlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  z-index: 200; display: flex; align-items: center; justify-content: center;
  padding: 1rem;
`;
const Modal = styled.div`
  background: white; border-radius: var(--radius-lg);
  width: 100%; max-width: 640px; max-height: 90vh;
  overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
`;
const ModalHeader = styled.div`
  background: #111827; color: white;
  padding: var(--spacing-lg); display: flex;
  justify-content: space-between; align-items: center;
  position: sticky; top: 0; z-index: 1;
`;
const ModalTitle = styled.h2`font-size: 0.88rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;`;
const CloseBtn = styled.button`color: rgba(255,255,255,0.7); font-size: 1.2rem; &:hover { color: white; }`;
const ModalBody = styled.div`padding: var(--spacing-xl); display: flex; flex-direction: column; gap: var(--spacing-lg);`;

const Section = styled.div``;
const SectionTitle = styled.p`
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--color-text-muted); margin-bottom: var(--spacing-sm);
`;

const ItemRow = styled.div`
  display: flex; align-items: flex-start; gap: var(--spacing-md);
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--color-border);
  &:last-child { border-bottom: none; }
`;
const ItemImg = styled.img`
  width: 72px; height: 72px; object-fit: cover;
  border-radius: var(--radius-md); background: #f5f5f5;
  flex-shrink: 0; border: 1px solid var(--color-border);
`;
const ItemInfo = styled.div`flex: 1; min-width: 0;`;
const ItemName = styled(Link)`
  font-size: 0.9rem; font-weight: 700; color: var(--color-text); line-height: 1.3;
  display: block; margin-bottom: 0.2rem;
  &:hover { color: var(--color-accent); }
`;
const ItemBrand = styled.p`font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 0.3rem;`;

const CustomTags = styled.div`display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.3rem;`;
const CustomTag = styled.span`
  display: inline-flex; align-items: center; gap: 0.2rem;
  background: #f3f4f6; border: 1px solid var(--color-border);
  font-size: 0.68rem; font-weight: 700; color: #374151;
  padding: 0.15rem 0.5rem; border-radius: var(--radius-full);
`;

const ItemQty = styled.span`
  display: inline-block; background: #111827; color: white;
  font-size: 0.65rem; font-weight: 700;
  padding: 0.15rem 0.45rem; border-radius: var(--radius-sm);
  margin-right: 0.3rem;
`;
const ItemPrice = styled.p`font-size: 0.95rem; font-weight: 800; flex-shrink: 0; padding-top: 0.1rem;`;

const InfoGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);`;
const InfoBox = styled.div`
  background: var(--color-bg-secondary); border: 1px solid var(--color-border);
  border-radius: var(--radius-md); padding: var(--spacing-md);
`;
const InfoLabel = styled.p`font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-text-muted); margin-bottom: 0.4rem;`;
const InfoValue = styled.p`font-size: 0.85rem; color: var(--color-text); line-height: 1.6;`;

const TotalRow = styled.div`
  display: flex; justify-content: space-between;
  font-size: ${({ $bold }) => $bold ? "1rem" : "0.88rem"};
  font-weight: ${({ $bold }) => $bold ? "800" : "400"};
  color: ${({ $bold }) => $bold ? "var(--color-text)" : "var(--color-text-muted)"};
  padding-top: ${({ $bold }) => $bold ? "var(--spacing-sm)" : "0"};
  border-top: ${({ $bold }) => $bold ? "2px solid var(--color-border)" : "none"};
  margin-top: ${({ $bold }) => $bold ? "var(--spacing-sm)" : "0"};
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.6rem; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700;
  background: ${({ $s }) => ({ pending: "#fef3c7", processing: "#dbeafe", shipped: "#ede9fe", delivered: "#dcfce7", cancelled: "#fee2e2" }[$s] || "#f3f4f6")};
  color: ${({ $s }) => ({ pending: "#92400e", processing: "#1e40af", shipped: "#5b21b6", delivered: "#166534", cancelled: "#991b1b" }[$s] || "#374151")};
`;

const statusLabels  = { pending: "Pendiente", processing: "Procesando", shipped: "Enviado", delivered: "Entregado", cancelled: "Cancelado" };
const zoneLabels    = { peninsula: "España peninsular", baleares: "Islas Baleares", canarias: "Islas Canarias", ceuta: "Ceuta y Melilla", portugal: "Portugal", europa: "Resto de Europa" };
const paymentLabels = { card: "💳 Tarjeta", paypal: "🅿️ PayPal", transfer: "🏦 Transferencia bancaria" };

const OrderDetail = ({ order, onClose }) => {
  if (!order) return null;

  const subtotal = order.items?.reduce((sum, i) => sum + (i.price * i.quantity), 0) || 0;
  const shipping  = order.total - subtotal;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Pedido #{order._id?.slice(-8).toUpperCase()}</ModalTitle>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </ModalHeader>

        <ModalBody>
          {/* Estado */}
          <Section>
            <SectionTitle>Estado del pedido</SectionTitle>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <StatusBadge $s={order.status}>{statusLabels[order.status] || order.status}</StatusBadge>
              <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
                {new Date(order.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          </Section>

          {/* Productos */}
          <Section>
            <SectionTitle>Productos ({order.items?.length})</SectionTitle>
            {order.items?.map((item, i) => {
              const prod = item.product;
              const c    = item.customization || {};
              return (
                <ItemRow key={i}>
                  <ItemImg
                    src={prod?.image_url || "/camisretro.jpg"}
                    alt={prod?.name || "Camiseta"}
                    onError={e => { e.target.src = "/camisretro.jpg"; }}
                  />
                  <ItemInfo>
                    {prod?._id ? (
                      <ItemName to={`/products/${prod._id}`} onClick={onClose}>
                        {prod?.name || "Camiseta"}
                      </ItemName>
                    ) : (
                      <ItemName as="p">{prod?.name || "Camiseta"}</ItemName>
                    )}
                    <ItemBrand>
                      {prod?.brand && <span>{prod.brand}</span>}
                      {prod?.temporada && <span> · Temp. {prod.temporada}</span>}
                    </ItemBrand>

                    {/* Talla y personalización */}
                    <CustomTags>
                      {c.size && <CustomTag>📐 Talla {c.size}</CustomTag>}
                      {c.name && <CustomTag>👤 {c.name}</CustomTag>}
                      {c.number && <CustomTag>🔢 #{c.number}</CustomTag>}
                      {c.patch && c.patch !== "Sin parches" && <CustomTag>🏆 {c.patch}</CustomTag>}
                    </CustomTags>

                    <div style={{ marginTop: "0.4rem" }}>
                      <ItemQty>×{item.quantity}</ItemQty>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                        {item.price?.toFixed(2)} € / ud
                      </span>
                    </div>
                  </ItemInfo>
                  <ItemPrice>{(item.price * item.quantity).toFixed(2)} €</ItemPrice>
                </ItemRow>
              );
            })}
          </Section>

          {/* Dirección y pago */}
          <InfoGrid>
            <InfoBox>
              <InfoLabel>📍 Dirección de envío</InfoLabel>
              <InfoValue>
                {order.address?.street}<br />
                {order.address?.postalCode} {order.address?.city}<br />
                {zoneLabels[order.address?.zone] || order.address?.country || "España"}
              </InfoValue>
            </InfoBox>
            <InfoBox>
              <InfoLabel>💳 Método de pago</InfoLabel>
              <InfoValue>{paymentLabels[order.paymentMethod] || order.paymentMethod}</InfoValue>
            </InfoBox>
          </InfoGrid>

          {/* Resumen de precios */}
          <Section>
            <SectionTitle>Resumen de precios</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <TotalRow><span>Subtotal</span><span>{subtotal.toFixed(2)} €</span></TotalRow>
              <TotalRow><span>Envío</span><span>{shipping <= 0 ? "Gratis 🎉" : `${shipping.toFixed(2)} €`}</span></TotalRow>
              <TotalRow $bold><span>Total</span><span>{order.total?.toFixed(2)} €</span></TotalRow>
            </div>
          </Section>
        </ModalBody>
      </Modal>
    </Overlay>
  );
};

export default OrderDetail;