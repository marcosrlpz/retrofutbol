import { Link } from "react-router-dom";
import styled from "styled-components";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { getAllProductsService } from "../services/product.service";
import api from "../services/auth.service";
import useFetch from "../hooks/useFetch";
import { useCallback } from "react";
import ProductCard from "../components/ui/ProductCard";
import { SkeletonGrid } from "../components/ui/SkeletonCard";

const Wrap = styled.div`
  max-width: 1400px; margin: 0 auto;
  padding: 2rem 2.5rem;
  @media (max-width: 768px) { padding: 1.5rem 1rem; }
`;

const Header = styled.div`
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: var(--spacing-sm);
  margin-bottom: var(--spacing-2xl);
  display: flex; justify-content: space-between; align-items: flex-end;
`;

const Title = styled.h1`
  font-size: var(--font-size-xl); font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.04em;
`;

const Count = styled.p`font-size: 0.82rem; color: var(--color-text-muted);`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); gap: var(--spacing-sm); }
`;

const Empty = styled.div`
  text-align: center; padding: 5rem 2rem;
  p { color: var(--color-text-muted); margin-bottom: var(--spacing-lg); font-size: 0.95rem; }
`;

const ShopBtn = styled(Link)`
  display: inline-block; background: #111827; color: white;
  font-weight: 700; font-size: 0.88rem;
  padding: 0.75rem 1.5rem; border-radius: var(--radius-md); transition: var(--transition);
  &:hover { background: var(--color-accent); }
`;

const LoginMsg = styled.div`
  text-align: center; padding: 5rem 2rem;
  p { color: var(--color-text-muted); margin-bottom: var(--spacing-lg); font-size: 0.95rem; }
`;

const LoginBtn = styled(Link)`
  display: inline-block; background: #111827; color: white;
  font-weight: 700; font-size: 0.88rem;
  padding: 0.75rem 1.5rem; border-radius: var(--radius-md); transition: var(--transition);
  &:hover { background: var(--color-accent); }
`;

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  // Si está logueado: carga desde BD directamente
  const fetchBD = useCallback(() => isAuthenticated ? api.get("/wishlist").then(r => r.data) : Promise.resolve({ wishlist: [] }), [isAuthenticated]);
  const { data: bdData, loading: bdLoading } = useFetch(fetchBD, [isAuthenticated]);

  // Si no está logueado: filtra desde todos los productos por localStorage
  const fetchAll = useCallback(() => !isAuthenticated ? getAllProductsService({}) : Promise.resolve({ products: [] }), [isAuthenticated]);
  const { data: allData, loading: allLoading } = useFetch(fetchAll, [isAuthenticated]);

  const loading = isAuthenticated ? bdLoading : allLoading;

  const wished = isAuthenticated
    ? (bdData?.wishlist || [])
    : (allData?.products || []).filter(p => wishlist.includes(p._id));

  return (
    <Wrap>
      <Header>
        <Title>❤️ Mis favoritos</Title>
        <Count>{wished.length} camiseta{wished.length !== 1 ? "s" : ""}</Count>
      </Header>

      {loading ? <SkeletonGrid count={4} columns={4} /> : wished.length === 0 ? (
        isAuthenticated ? (
          <Empty>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🤍</div>
            <p>Aún no tienes camisetas en favoritos.<br />Pulsa el corazón en cualquier camiseta para guardarla aquí.</p>
            <ShopBtn to="/products">Ver todas las camisetas</ShopBtn>
          </Empty>
        ) : (
          <LoginMsg>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔒</div>
            <p>Inicia sesión para guardar tus favoritos<br />y acceder a ellos desde cualquier dispositivo.</p>
            <LoginBtn to="/login">Iniciar sesión</LoginBtn>
          </LoginMsg>
        )
      ) : (
        <Grid>
          {wished.map(p => <ProductCard key={p._id} product={p} />)}
        </Grid>
      )}
    </Wrap>
  );
};

export default Wishlist;