import { useState, useCallback } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import { getAllProductsService, deleteProductService } from "../../services/product.service";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/ui/Loader";
import ProductForm from "../../components/admin/ProductForm";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: var(--spacing-sm);
`;

const Title = styled.h1`
  font-size: var(--font-size-xl);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const AddBtn = styled.button`
  background: #111827;
  color: white;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-md);
  transition: var(--transition);
  &:hover { background: var(--color-accent); }
`;

const Table = styled.div`
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 120px 100px 70px 80px 110px;
  padding: 0.75rem var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 120px 100px 70px 80px 110px;
  padding: 0.75rem var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  align-items: center;
  transition: var(--transition);
  &:last-child { border-bottom: none; }
  &:hover { background: var(--color-bg-secondary); }
`;

const ProductImg = styled.img`
  width: 44px;
  height: 55px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
`;

const ProductName = styled.p`font-weight: 600; font-size: 0.85rem;`;
const ProductClub = styled.p`font-size: 0.75rem; color: var(--color-text-muted);`;

const LeagueBadge = styled.span`
  font-size: 0.68rem;
  padding: 0.2rem 0.5rem;
  background: #111827;
  color: white;
  border-radius: var(--radius-sm);
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Price = styled.p`font-weight: 700; font-size: 0.85rem;`;
const Stock = styled.p`
  font-weight: 600;
  font-size: 0.85rem;
  color: ${({ $low }) => $low ? "var(--color-danger)" : "var(--color-text)"};
`;
const Temporada = styled.p`font-size: 0.75rem; color: var(--color-text-muted);`;

const Actions = styled.div`display: flex; gap: 0.4rem;`;

const ActionBtn = styled.button`
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  transition: var(--transition);
  &:hover { border-color: ${({ $danger }) => $danger ? "var(--color-danger)" : "var(--color-primary)"}; background: ${({ $danger }) => $danger ? "rgba(220,38,38,0.06)" : "var(--color-bg-secondary)"}; }
`;

/* ── PAGINACIÓN ─────────────────────────────────────────────────── */
const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-sm);
`;

const PaginationInfo = styled.p`
  font-size: 0.82rem;
  color: var(--color-text-muted);
`;

const PaginationBtns = styled.div`
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
`;

const PageBtn = styled.button`
  min-width: 34px;
  height: 34px;
  padding: 0 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid ${({ $active }) => $active ? "#111827" : "var(--color-border)"};
  background: ${({ $active }) => $active ? "#111827" : "white"};
  color: ${({ $active }) => $active ? "white" : "var(--color-text)"};
  font-size: 0.82rem;
  font-weight: ${({ $active }) => $active ? "700" : "500"};
  transition: var(--transition);
  font-family: var(--font-family);
  &:hover:not(:disabled) { border-color: #111827; background: ${({ $active }) => $active ? "#111827" : "var(--color-bg-secondary)"}; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const LIMIT = 20;

const ManageProducts = () => {
  const [showForm, setShowForm]     = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [page, setPage]             = useState(1);

  const fetcher = useCallback(
    () => getAllProductsService({ page, limit: LIMIT }),
    [page]
  );
  const { data, loading, refetch } = useFetch(fetcher, [page]);

  const products   = data?.products || [];
  const total      = data?.total    || 0;
  const totalPages = Math.ceil(total / LIMIT);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Eliminar "${name}"?`)) return;
    try {
      await deleteProductService(id);
      toast.success("Camiseta eliminada");
      refetch();
    } catch { toast.error("Error al eliminar"); }
  };

  const handleClose = () => { setShowForm(false); setEditProduct(null); refetch(); };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  };

  return (
    <>
      <Header>
        <Title>📦 Gestión de camisetas {total > 0 && <span style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", fontWeight: 500 }}>({total} total)</span>}</Title>
        <AddBtn onClick={() => { setEditProduct(null); setShowForm(true); }}>+ Nueva camiseta</AddBtn>
      </Header>

      {showForm && <ProductForm product={editProduct} onClose={handleClose} />}

      {loading ? <Loader /> : (
        <>
          <Table>
            <TableHeader>
              <span>Img</span>
              <span>Camiseta</span>
              <span>Liga</span>
              <span>Precio</span>
              <span>Stock</span>
              <span>Temp.</span>
              <span>Acciones</span>
            </TableHeader>
            {products.map(p => (
              <TableRow key={p._id}>
                <ProductImg src={p.image_url || "https://via.placeholder.com/44x55"} alt={p.name} />
                <div>
                  <ProductName>{p.name}</ProductName>
                  <ProductClub>{p.brand}</ProductClub>
                </div>
                <LeagueBadge>{p.category}</LeagueBadge>
                <Price>{p.price?.toFixed(2)} €</Price>
                <Stock $low={p.stock < 3}>{p.stock}</Stock>
                <Temporada>{p.temporada || "—"}</Temporada>
                <Actions>
                  <ActionBtn onClick={() => { setEditProduct(p); setShowForm(true); }}>✏️</ActionBtn>
                  <ActionBtn $danger onClick={() => handleDelete(p._id, p.name)}>🗑️</ActionBtn>
                </Actions>
              </TableRow>
            ))}
          </Table>

          {totalPages > 1 && (
            <PaginationWrapper>
              <PaginationInfo>
                Mostrando {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} de {total} camisetas
              </PaginationInfo>
              <PaginationBtns>
                <PageBtn onClick={() => setPage(p => p - 1)} disabled={page === 1}>←</PageBtn>
                {getPageNumbers().map(n => (
                  <PageBtn key={n} $active={n === page} onClick={() => setPage(n)}>{n}</PageBtn>
                ))}
                <PageBtn onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>→</PageBtn>
              </PaginationBtns>
            </PaginationWrapper>
          )}
        </>
      )}
    </>
  );
};

export default ManageProducts;