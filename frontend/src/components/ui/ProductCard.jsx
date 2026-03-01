import { memo } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useWishlist } from "../../context/WishlistContext";

const Card = styled(motion.article)`
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: box-shadow 0.2s, border-color 0.2s;
  display: flex;
  flex-direction: column;
  position: relative;
  &:hover {
    box-shadow: var(--shadow-md);
    border-color: #ccc;
  }
`;

const ImageWrapper = styled(Link)`
  position: relative; aspect-ratio: 3/4; overflow: hidden;
  background: #f5f5f5; display: block;
`;

const Image = styled.img`
  width: 100%; height: 100%; object-fit: cover; object-position: center top;
  transition: transform 0.5s ease;
  ${Card}:hover & { transform: scale(1.04); }
`;

const LeagueBadge = styled.span`
  position: absolute; top: 0.5rem; left: 0.5rem;
  background: #111827; color: white; font-size: 0.58rem; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase;
  padding: 0.2rem 0.45rem; border-radius: var(--radius-sm);
`;

const StockBadge = styled.span`
  position: absolute; top: 0.5rem; right: 0.5rem;
  background: var(--color-accent); color: white;
  font-size: 0.58rem; font-weight: 700;
  padding: 0.2rem 0.45rem; border-radius: var(--radius-sm);
`;

const WishBtn = styled.button`
  position: absolute;
  top: 0.5rem; right: 0.5rem;
  width: 32px; height: 32px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem;
  transition: var(--transition);
  z-index: 2;
  &:hover { transform: scale(1.15); }
`;

const Body = styled.div`
  padding: 0.65rem 0.75rem; display: flex; flex-direction: column; gap: 0.2rem; flex: 1;
`;

const Club = styled.p`
  font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--color-text-muted);
`;

const ProductName = styled(Link)`
  font-size: 0.82rem; font-weight: 700; color: var(--color-text); line-height: 1.3;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  &:hover { color: var(--color-accent); }
`;

const Temporada = styled.p`font-size: 0.7rem; color: var(--color-text-light);`;

const Footer = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-top: auto; padding-top: 0.5rem;
`;

const Price = styled.span`font-size: 1rem; font-weight: 800; color: var(--color-text);`;
const AgotadoBadge = styled.span`font-size: 0.7rem; font-weight: 700; color: var(--color-text-muted);`;

const cardVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.35, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const ProductCard = memo(({ product, index = 0 }) => {
  const { toggle, isWished } = useWishlist();
  const wished = isWished(product._id);

  return (
    <Card
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
    >
      <ImageWrapper to={`/products/${product._id}`}>
        <Image src={product.image_url || "/camisretro.jpg"} alt={product.name} loading="lazy" />
        <LeagueBadge>{product.category}</LeagueBadge>
        {product.stock === 0
          ? <StockBadge>Agotado</StockBadge>
          : (
            <WishBtn
              onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(product._id); }}
              title={wished ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              {wished ? "❤️" : "🤍"}
            </WishBtn>
          )
        }
      </ImageWrapper>
      <Body>
        <Club>{product.brand}</Club>
        <ProductName to={`/products/${product._id}`}>{product.name}</ProductName>
        {product.temporada && <Temporada>Temp. {product.temporada}</Temporada>}
        <Footer>
          <Price>{product.price?.toFixed(2)} €</Price>
          {product.stock === 0 && <AgotadoBadge>Agotado</AgotadoBadge>}
        </Footer>
      </Body>
    </Card>
  );
});

ProductCard.displayName = "ProductCard";
export default ProductCard;