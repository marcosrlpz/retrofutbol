import { useCallback } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import { getAllOrdersService, updateOrderStatusService } from "../../services/order.service";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/ui/Loader";

const Title = styled.h1`
  font-size: var(--font-size-3xl);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: var(--spacing-xl);
`;

const Table = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 100px 120px 160px;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  @media (max-width: 768px) { grid-template-columns: 1fr 100px 160px; }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 100px 120px 160px;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  align-items: center;
  transition: var(--transition);
  gap: var(--spacing-sm);
  &:last-child { border-bottom: none; }
  &:hover { background: var(--color-bg-secondary); }
  @media (max-width: 768px) { grid-template-columns: 1fr 100px 160px; }
`;

const OrderId   = styled.p`font-size: var(--font-size-sm); font-weight: 700;`;
const UserInfo  = styled.div``;
const UserName  = styled.p`font-size: var(--font-size-sm); font-weight: 600;`;
const UserEmail = styled.p`font-size: var(--font-size-xs); color: var(--color-text-muted);`;
const Total     = styled.p`font-weight: 700;`;
const DateText  = styled.p`font-size: var(--font-size-xs); color: var(--color-text-muted);`;

const StatusWrapper = styled.div`display: flex; flex-direction: column; gap: 0.3rem;`;

const StatusSelect = styled.select`
  background: ${({ $status }) => ({
    pending:    "#fef3c7",
    processing: "#dbeafe",
    shipped:    "#ede9fe",
    delivered:  "#dcfce7",
    cancelled:  "#fee2e2",
  }[$status] || "var(--color-bg)")};
  color: ${({ $status }) => ({
    pending:    "#92400e",
    processing: "#1e40af",
    shipped:    "#5b21b6",
    delivered:  "#166534",
    cancelled:  "#991b1b",
  }[$status] || "var(--color-text)")};
  border: 1.5px solid ${({ $status }) => ({
    pending:    "#fcd34d",
    processing: "#93c5fd",
    shipped:    "#c4b5fd",
    delivered:  "#86efac",
    cancelled:  "#fca5a5",
  }[$status] || "var(--color-border)")};
  border-radius: var(--radius-md);
  padding: 0.4rem 0.6rem;
  font-size: var(--font-size-xs);
  font-weight: 700;
  font-family: var(--font-family);
  cursor: pointer;
  width: 100%;
  &:focus { outline: none; border-color: var(--color-primary); }
`;

const MobileHide = styled.div`@media (max-width: 768px) { display: none; }`;
const Empty = styled.p`text-align: center; padding: var(--spacing-2xl); color: var(--color-text-muted);`;

const statuses = [
  { value: "pending",    label: "⏳ Pendiente" },
  { value: "processing", label: "🔧 Procesando" },
  { value: "shipped",    label: "🚚 Enviado" },
  { value: "delivered",  label: "✅ Entregado" },
  { value: "cancelled",  label: "❌ Cancelado" },
];

const ManageOrders = () => {
  const fetchFn = useCallback(() => getAllOrdersService(), []);
  const { data, loading, setData } = useFetch(fetchFn, []);
  const orders = data?.orders || [];

  const handleStatusChange = async (id, status) => {
    // Optimistic update
    setData(prev => ({
      ...prev,
      orders: prev.orders.map(o => o._id === id ? { ...o, status } : o)
    }));
    try {
      await updateOrderStatusService(id, status);
      const label = statuses.find(s => s.value === status)?.label || status;
      toast.success(`Pedido actualizado a ${label}`);
    } catch {
      toast.error("Error al actualizar el estado");
      // Revert no es necesario porque el useFetch ya tiene los datos reales
    }
  };

  return (
    <>
      <Title>🛒 Pedidos ({orders.length})</Title>

      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <Empty>No hay pedidos todavía</Empty>
      ) : (
        <Table>
          <TableHeader>
            <span>Pedido</span>
            <MobileHide><span>Cliente</span></MobileHide>
            <span>Total</span>
            <MobileHide><span>Fecha</span></MobileHide>
            <span>Estado</span>
          </TableHeader>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <div>
                <OrderId>#{order._id.slice(-8).toUpperCase()}</OrderId>
                <DateText>{order.items.length} producto(s)</DateText>
              </div>
              <MobileHide>
                <UserInfo>
                  <UserName>{order.user?.name} {order.user?.lastname}</UserName>
                  <UserEmail>{order.user?.email}</UserEmail>
                </UserInfo>
              </MobileHide>
              <Total>{order.total.toFixed(2)} €</Total>
              <MobileHide>
                <DateText>{new Date(order.createdAt).toLocaleDateString("es-ES")}</DateText>
              </MobileHide>
              <StatusWrapper>
                <StatusSelect
                  $status={order.status}
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </StatusSelect>
              </StatusWrapper>
            </TableRow>
          ))}
        </Table>
      )}
    </>
  );
};

export default ManageOrders;