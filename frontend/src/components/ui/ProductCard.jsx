import { memo } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import useCart from "../../hooks/useCart";

const Card = styled.article`
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
    border-color: #ccc;
  }
`;

const ImageWrapper = styled(Link)`
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  background: #f5f5f5;
  display: block;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transition: transform 0.5s ease;
  ${Card}:hover & { transform: scale(1.04); }
`;

const LeagueBadge = styled.span`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: #111827;
  color: white;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.2rem 0.45rem;
  border-radius: var(--radius-sm);
`;

const StockBadge = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: var(--color-accent);
  color: white;
  font-size: 0.58rem;
  font-weight: 700;
  padding: 0.2rem 0.45rem;
  border-radius: var(--radius-sm);
`;

const Body = styled.div`
  padding: 0.65rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
`;

const Club = styled.p`
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
`;

const Name = styled(Link)`
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  &:hover { color: var(--color-accent); }
`;

const Temporada = styled.p`
  font-size: 0.7rem;
  color: var(--color-text-light);
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 0.5rem;
`;

const Price = styled.span`
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-text);
`;

const CartBtn = styled.button`
  background: #111827;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.38rem 0.7rem;
  border-radius: var(--radius-sm);
  transition: var(--transition);
  white-space: nowrap;
  &:hover { background: var(--color-accent); }
  &:disabled { opacity: 0.4; cursor: not-allowed; background: #111827; }
`;

const ProductCard = memo(({ product }) => {
  const { addItem } = useCart();
  return (
    <Card>
      <ImageWrapper to={`/products/${product._id}`}>
        <Image
          src={product.image_url || "/camisretro.jpg"}
          alt={product.name}
          loading="lazy"
        />
        <LeagueBadge>{product.category}</LeagueBadge>
        {product.stock === 0 && <StockBadge>Agotado</StockBadge>}
      </ImageWrapper>
      <Body>
        <Club>{product.brand}</Club>
        <Name to={`/products/${product._id}`}>{product.name}</Name>
        {product.temporada && <Temporada>Temp. {product.temporada}</Temporada>}
        <Footer>
          <Price>{product.price?.toFixed(2)} €</Price>
          <CartBtn onClick={() => addItem(product)} disabled={product.stock === 0}>
            {product.stock === 0 ? "Agotado" : "+ Carrito"}
          </CartBtn>
        </Footer>
      </Body>
    </Card>
  );
});

ProductCard.displayName = "ProductCard";
export default ProductCard;