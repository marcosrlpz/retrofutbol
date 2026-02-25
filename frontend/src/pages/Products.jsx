import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { getAllProductsService } from "../services/product.service";
import useFetch from "../hooks/useFetch";
import ProductCard from "../components/ui/ProductCard";
import Loader from "../components/ui/Loader";

const PageWrap = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 2.5rem;
  @media (max-width: 768px) { padding: 1.5rem 1rem; }
`;

const Header = styled.div`
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const Title = styled.h1`
  font-size: var(--font-size-xl);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Count = styled.p`font-size: 0.82rem; color: var(--color-text-muted);`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: var(--spacing-2xl);
  align-items: start;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const Sidebar = styled.aside`
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: sticky;
  top: calc(var(--navbar-height) + var(--spacing-md));
  @media (max-width: 1024px) { display: none; }
`;

const FilterSection = styled.div`
  border-bottom: 1px solid var(--color-border);
  &:last-child { border-bottom: none; }
`;

const FilterTitle = styled.div`
  padding: 0.85rem var(--spacing-md);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: var(--color-bg-secondary);
  color: var(--color-text-muted);
`;

const FilterOpt = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.6rem var(--spacing-md);
  font-size: 0.85rem;
  font-weight: ${({ $active }) => $active ? "700" : "400"};
  color: ${({ $active }) => $active ? "var(--color-accent)" : "var(--color-text)"};
  background: ${({ $active }) => $active ? "var(--color-accent-light)" : "transparent"};
  border-left: 2px solid ${({ $active }) => $active ? "var(--color-accent)" : "transparent"};
  transition: var(--transition);
  &:hover { background: var(--color-accent-light); color: var(--color-accent); }
`;

const ClearBtn = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-align: center;
  transition: var(--transition);
  &:hover { color: var(--color-accent); }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--spacing-md);
`;

const SortSelect = styled.select`
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.5rem 0.85rem;
  font-size: 0.82rem;
  font-family: var(--font-family);
  color: var(--color-text);
  &:focus { outline: none; border-color: var(--color-primary); }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  @media (max-width: 1280px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); gap: var(--spacing-sm); }
`;

const Empty = styled.div`
  grid-column: 1/-1;
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-muted);
`;

const leagues = ["La Liga", "Premier League", "Serie A", "Bundesliga", "Otros Paises", "Selecciones"];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("createdAt");

  const filters = useMemo(() => ({
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    search: searchParams.get("search") || "",
    sort,
  }), [searchParams, sort]);

  const { data, loading, error } = useFetch(
    useCallback(() => getAllProductsService(filters), [filters]),
    [filters]
  );

  const setFilter = (key, value) => {
    const current = Object.fromEntries(searchParams.entries());
    if (current[key] === value) delete current[key];
    else current[key] = value;
    setSearchParams(current);
  };

  const products = data?.products || [];

  return (
    <PageWrap>
      <Header>
        <Title>
          {filters.search ? `Busqueda: "${filters.search}"` : filters.brand ? filters.brand : filters.category ? filters.category : "Todas las camisetas"}
        </Title>
        <Count>{products.length} camisetas</Count>
      </Header>

      <Layout>
        <Sidebar>
          <FilterSection>
            <FilterTitle>Liga / Categoria</FilterTitle>
            {leagues.map(l => (
              <FilterOpt key={l} $active={filters.category === l} onClick={() => setFilter("category", l)}>
                {l}
              </FilterOpt>
            ))}
          </FilterSection>
          <ClearBtn onClick={() => setSearchParams({})}>✕ Limpiar filtros</ClearBtn>
        </Sidebar>

        <div>
          <TopBar>
            <SortSelect value={sort} onChange={e => setSort(e.target.value)}>
              <option value="createdAt">Mas recientes</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
              <option value="rating">Mejor valorados</option>
            </SortSelect>
          </TopBar>

          {loading ? <Loader /> : error ? (
            <Empty>Error al cargar las camisetas</Empty>
          ) : products.length === 0 ? (
            <Empty>No se encontraron camisetas</Empty>
          ) : (
            <Grid>
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </Grid>
          )}
        </div>
      </Layout>
    </PageWrap>
  );
};

export default Products;