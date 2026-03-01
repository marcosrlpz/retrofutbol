import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { getAllProductsService } from "../services/product.service";
import useFetch from "../hooks/useFetch";
import ProductCard from "../components/ui/ProductCard";
import { SkeletonGrid } from "../components/ui/SkeletonCard";

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

const PriceRange = styled.div`
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;
const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 0.82rem;
  color: var(--color-text-muted);
`;
const PriceInput = styled.input`
  width: 65px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.35rem 0.5rem;
  font-size: 0.82rem;
  font-family: var(--font-family);
  color: var(--color-text);
  &:focus { outline: none; border-color: var(--color-primary); }
`;
const PriceSlider = styled.input`
  width: 100%;
  accent-color: var(--color-accent);
  cursor: pointer;
`;

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: var(--spacing-md);
`;
const FilterTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #111827;
  color: white;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius-full);
  button {
    background: none;
    color: rgba(255,255,255,0.7);
    font-size: 0.8rem;
    line-height: 1;
    &:hover { color: white; }
  }
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const MobileFilterBtn = styled.button`
  display: none;
  align-items: center;
  gap: 0.4rem;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.5rem 0.85rem;
  font-size: 0.82rem;
  font-weight: 700;
  font-family: var(--font-family);
  cursor: pointer;
  @media (max-width: 1024px) { display: flex; }
`;
const Overlay = styled.div`
  display: none;
  @media (max-width: 1024px) {
    display: ${({ $open }) => $open ? "block" : "none"};
    position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100;
  }
`;
const Drawer = styled.div`
  display: none;
  @media (max-width: 1024px) {
    display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; bottom: 0; width: 280px;
    background: white; z-index: 101; overflow-y: auto;
    transform: ${({ $open }) => $open ? "translateX(0)" : "translateX(-100%)"};
    transition: transform 0.3s ease;
    border: 1px solid var(--color-border);
  }
`;
const DrawerHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: var(--spacing-lg); border-bottom: 1px solid var(--color-border);
  font-weight: 800; font-size: 1rem;
  button { font-size: 1.2rem; color: var(--color-text-muted); background: none; cursor: pointer; }
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

const ScrollList = styled.div`max-height: 200px; overflow-y: auto;`;

// ── PAGINACIÓN ────────────────────────────────────────────────────────
const PaginationWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin-top: var(--spacing-2xl);
  flex-wrap: wrap;
`;

const PageBtn = styled.button`
  min-width: 38px;
  height: 38px;
  padding: 0 0.6rem;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: ${({ $active }) => $active ? "800" : "500"};
  font-family: var(--font-family);
  background: ${({ $active }) => $active ? "#111827" : "white"};
  color: ${({ $active }) => $active ? "white" : "var(--color-text)"};
  border: 1px solid ${({ $active }) => $active ? "#111827" : "var(--color-border)"};
  transition: var(--transition);
  cursor: pointer;
  &:hover:not(:disabled) {
    background: ${({ $active }) => $active ? "#111827" : "var(--color-accent-light)"};
    border-color: var(--color-accent);
    color: ${({ $active }) => $active ? "white" : "var(--color-accent)"};
  }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
`;

const PageInfo = styled.span`
  font-size: 0.8rem;
  color: var(--color-text-muted);
  padding: 0 0.5rem;
`;

const leagues = ["La Liga", "Premier League", "Serie A", "Bundesliga", "Otros Paises", "Selecciones"];
const LIMIT = 12;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort]           = useState("createdAt");
  const [maxPrice, setMaxPrice]   = useState(200);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentPage = parseInt(searchParams.get("page") || "1");

  const filters = useMemo(() => ({
    category:  searchParams.get("category") || "",
    brand:     searchParams.get("brand") || "",
    search:    searchParams.get("search") || "",
    temporada: searchParams.get("temporada") || "",
    sort,
    page:  currentPage,
    limit: LIMIT,
  }), [searchParams, sort, currentPage]);

  const { data, loading, error } = useFetch(
    useCallback(() => getAllProductsService(filters), [filters]),
    [filters]
  );

  const setFilter = (key, value) => {
    const current = Object.fromEntries(searchParams.entries());
    if (current[key] === value) delete current[key];
    else current[key] = value;
    // Al cambiar filtro volvemos a página 1
    delete current.page;
    setSearchParams(current);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPage = (page) => {
    const current = Object.fromEntries(searchParams.entries());
    current.page = page;
    setSearchParams(current);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const allProducts = data?.products || [];
  const total       = data?.total || 0;
  const totalPages  = data?.totalPages || 1;

  // Filtro de precio solo en frontend (es rápido)
  const products = allProducts.filter(p => p.price <= maxPrice);

  const activeFilters = [];
  if (filters.category)  activeFilters.push({ label: filters.category, key: "category" });
  if (filters.brand)     activeFilters.push({ label: filters.brand, key: "brand" });
  if (filters.search)    activeFilters.push({ label: `"${filters.search}"`, key: "search" });
  if (filters.temporada) activeFilters.push({ label: `Temp. ${filters.temporada}`, key: "temporada" });
  if (maxPrice < 200)    activeFilters.push({ label: `Hasta ${maxPrice}€`, key: "price" });

  // Equipos y temporadas del resultado actual para los filtros
  const availableTeams = useMemo(() =>
    [...new Set(allProducts.map(p => p.brand).filter(Boolean))].sort()
  , [allProducts]);

  const availableTemporadas = useMemo(() =>
    [...new Set(allProducts.map(p => p.temporada).filter(Boolean))].sort().reverse()
  , [allProducts]);

  // Números de página a mostrar (máx 5 botones)
  const pageNumbers = useMemo(() => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end   = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  const FilterContent = () => (
    <>
      <FilterSection>
        <FilterTitle>Liga / Categoria</FilterTitle>
        {leagues.map(l => (
          <FilterOpt key={l} $active={filters.category === l} onClick={() => setFilter("category", l)}>
            {l}
          </FilterOpt>
        ))}
      </FilterSection>

      {availableTeams.length > 0 && (
        <FilterSection>
          <FilterTitle>Equipo</FilterTitle>
          <ScrollList>
            {availableTeams.map(t => (
              <FilterOpt key={t} $active={filters.brand === t} onClick={() => setFilter("brand", t)}>
                {t}
              </FilterOpt>
            ))}
          </ScrollList>
        </FilterSection>
      )}

      {availableTemporadas.length > 0 && (
        <FilterSection>
          <FilterTitle>Temporada</FilterTitle>
          <ScrollList>
            {availableTemporadas.map(t => (
              <FilterOpt key={t} $active={filters.temporada === t} onClick={() => setFilter("temporada", t)}>
                {t}
              </FilterOpt>
            ))}
          </ScrollList>
        </FilterSection>
      )}

      <FilterSection>
        <FilterTitle>Precio máximo</FilterTitle>
        <PriceRange>
          <PriceRow>
            <span>Hasta</span>
            <PriceInput
              type="number"
              value={maxPrice}
              min={10}
              max={200}
              onChange={e => setMaxPrice(Number(e.target.value))}
            />
            <span>€</span>
          </PriceRow>
          <PriceSlider
            type="range"
            min={10}
            max={200}
            step={5}
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
          />
          <PriceRow style={{ justifyContent: "space-between" }}>
            <span>10€</span>
            <span style={{ fontWeight: 700, color: "var(--color-text)" }}>{maxPrice}€</span>
            <span>200€</span>
          </PriceRow>
        </PriceRange>
      </FilterSection>

      <ClearBtn onClick={() => { setSearchParams({}); setMaxPrice(200); }}>
        ✕ Limpiar filtros
      </ClearBtn>
    </>
  );

  return (
    <PageWrap>
      <Header>
        <Title>
          {filters.search    ? `Búsqueda: "${filters.search}"`
           : filters.brand   ? filters.brand
           : filters.category ? filters.category
           : "Todas las camisetas"}
        </Title>
        <Count>
          {total} camiseta{total !== 1 ? "s" : ""}
          {totalPages > 1 && ` · Página ${currentPage} de ${totalPages}`}
        </Count>
      </Header>

      <Layout>
        <Sidebar><FilterContent /></Sidebar>

        <Overlay $open={drawerOpen} onClick={() => setDrawerOpen(false)} />
        <Drawer $open={drawerOpen}>
          <DrawerHeader>
            Filtros
            <button onClick={() => setDrawerOpen(false)}>✕</button>
          </DrawerHeader>
          <FilterContent />
        </Drawer>

        <div>
          {activeFilters.length > 0 && (
            <ActiveFilters>
              {activeFilters.map(f => (
                <FilterTag key={f.key}>
                  {f.label}
                  <button onClick={() => {
                    if (f.key === "price") setMaxPrice(200);
                    else setFilter(f.key, "");
                  }}>✕</button>
                </FilterTag>
              ))}
            </ActiveFilters>
          )}

          <TopBar>
            <MobileFilterBtn onClick={() => setDrawerOpen(true)}>
              🔧 Filtros {activeFilters.length > 0 && `(${activeFilters.length})`}
            </MobileFilterBtn>
            <SortSelect value={sort} onChange={e => { setSort(e.target.value); goToPage(1); }}>
              <option value="createdAt">Más recientes</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
              <option value="rating">Mejor valorados</option>
            </SortSelect>
          </TopBar>

          {loading ? (
            <SkeletonGrid count={LIMIT} columns={3} />
          ) : error ? (
            <Empty>Error al cargar las camisetas</Empty>
          ) : products.length === 0 ? (
            <Empty>No se encontraron camisetas con esos filtros</Empty>
          ) : (
            <Grid>
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </Grid>
          )}

          {/* ── PAGINACIÓN ───────────────────────────────────────── */}
          {totalPages > 1 && (
            <PaginationWrap>
              <PageBtn
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                ←
              </PageBtn>

              {pageNumbers[0] > 1 && (
                <>
                  <PageBtn onClick={() => goToPage(1)}>1</PageBtn>
                  {pageNumbers[0] > 2 && <PageInfo>…</PageInfo>}
                </>
              )}

              {pageNumbers.map(n => (
                <PageBtn
                  key={n}
                  $active={n === currentPage}
                  onClick={() => goToPage(n)}
                >
                  {n}
                </PageBtn>
              ))}

              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                  {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <PageInfo>…</PageInfo>}
                  <PageBtn onClick={() => goToPage(totalPages)}>{totalPages}</PageBtn>
                </>
              )}

              <PageBtn
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                →
              </PageBtn>
            </PaginationWrap>
          )}
        </div>
      </Layout>
    </PageWrap>
  );
};

export default Products;