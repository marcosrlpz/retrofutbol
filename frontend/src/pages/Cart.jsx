import { Link } from "react-router-dom";
import styled from "styled-components";
import useCart from "../hooks/useCart";
import CartItem from "../components/ui/CartItem";

const Header = styled.div`
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: var(--font-size-xl);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const ClearBtn = styled.button`
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-text-muted);
  transition: var(--transition);
  &:hover { color: var(--color-danger); }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: var(--spacing-2xl);
  align-items: start;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const Summary = styled.div`
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: sticky;
  top: calc(var(--navbar-height) + var(--spacing-md));
`;

const SummaryHeader = styled.div`
  background: #111827;
  color: white;
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const SummaryBody = styled.div`
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
  color: ${({ $bold }) => $bold ? "var(--color-text)" : "var(--color-text-muted)"};
  font-weight: ${({ $bold }) => $bold ? "800" : "400"};
  padding-top: ${({ $bold }) => $bold ? "var(--spacing-sm)" : "0"};
  border-top: ${({ $bold }) => $bold ? "1px solid var(--color-border)" : "none"};
  font-size: ${({ $bold }) => $bold ? "1.1rem" : "0.88rem"};
`;

const FreeShipping = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-md);
  padding: 0.6rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-success);
  text-align: center;
`;

const CheckoutBtn = styled(Link)`
  display: block;
  background: #111827;
  color: white;
  text-align: center;
  padding: 0.9rem;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 0.95rem;
  transition: var(--transition);
  &:hover { background: var(--color-accent); }
`;

const ContinueLink = styled(Link)`
  display: block;
  text-align: center;
  padding: 0.7rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-muted);
  transition: var(--transition);
  &:hover { color: var(--color-text); }
`;

const Empty = styled.div`
  text-align: center;
  padding: var(--spacing-3xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
`;

const EmptyIcon = styled.p`font-size: 4rem;`;
const EmptyTitle = styled.h2`font-size: var(--font-size-xl); font-weight: 800;`;
const EmptyText = styled.p`color: var(--color-text-muted); font-size: 0.9rem;`;
const EmptyBtn = styled(Link)`
  background: #111827;
  color: white;
  padding: 0.85rem 2rem;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 0.9rem;
  transition: var(--transition);
  &:hover { background: var(--color-accent); }
`;

const Cart = () => {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const shipping = totalPrice >= 75 ? 0 : 4.99;
  const total = totalPrice + shipping;

  if (items.length === 0) return (
    <Empty>
      <EmptyIcon>🛒</EmptyIcon>
      <EmptyTitle>Tu carrito está vacío</EmptyTitle>
      <EmptyText>Aún no has añadido ninguna camiseta. ¡Echa un vistazo al catálogo!</EmptyText>
      <EmptyBtn to="/products">Ver camisetas</EmptyBtn>
    </Empty>
  );

  return (
    <>
      <Header>
        <Title>🛒 Mi carrito ({totalItems})</Title>
        <ClearBtn onClick={clearCart}>Vaciar carrito</ClearBtn>
      </Header>
      <Layout>
        <ItemsList>
          {items.map(item => <CartItem key={item.product._id} item={item} />)}
        </ItemsList>
        <Summary>
          <SummaryHeader>Resumen del pedido</SummaryHeader>
          <SummaryBody>
            <SummaryRow><span>Subtotal ({totalItems} uds)</span><span>{totalPrice.toFixed(2)} €</span></SummaryRow>
            <SummaryRow><span>Envío</span><span>{shipping === 0 ? "Gratis 🎉" : `${shipping.toFixed(2)} €`}</span></SummaryRow>
            {totalPrice < 75 && (
              <FreeShipping>
                ¡Te faltan {(75 - totalPrice).toFixed(2)} € para envío gratis!
              </FreeShipping>
            )}
            <SummaryRow $bold><span>Total</span><span>{total.toFixed(2)} €</span></SummaryRow>
            <CheckoutBtn to="/checkout">Finalizar pedido →</CheckoutBtn>
            <ContinueLink to="/products">← Seguir comprando</ContinueLink>
          </SummaryBody>
        </Summary>
      </Layout>
    </>
  );
};

export default Cart;