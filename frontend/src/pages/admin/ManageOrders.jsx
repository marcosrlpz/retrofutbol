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
  grid-template-columns: 1fr 1fr 100px 120px 140px;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);

  @media (max-width: 768px) {
    grid-template-columns: 1fr 100px 140px;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 100px 120px 140px;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  align-items: center;
  transition: var(--transition);
  gap: var(--spacing-sm);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--color-bg-secondary);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 100px 140px;
  }
`;

const OrderId = styled.p`
  font-size: var(--font-size-sm);
  font-weight: 700;
`;

const UserInfo = styled.div``;

const UserName = styled.p`
  font-size: var(--font-size-sm);
  font-weight: 600;
`;

const UserEmail = styled.p`
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
`;

const Total = styled.p`
  font-weight: 700;
`;

const Date = styled.p`
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
`;

const StatusSelect = styled.select`
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.4rem 0.6rem;
  color: var(--color-text);
  font-size: var(--font-size-xs);
  font-family: var(--font-family);
  cursor: pointer;
  width: 100%;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const MobileHide = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const Empty = styled.p`
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-muted);
`;

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

const ManageOrders = () => {
  const fetchFn = useCallback(() => getAllOrdersService(), []);
  const { data, loading, refetch } = useFetch(fetchFn, []);

  const orders = data?.orders || [];

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatusService(id, status);
      toast.success("Estado actualizado");
      refetch();
    } catch {
      toast.error("Error al actualizar el estado");
    }
  };

  return (
    <>
      <Title>🛒 Pedidos</Title>

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
                <Date>{order.items.length} producto(s)</Date>
              </div>
              <MobileHide>
                <UserInfo>
                  <UserName>{order.user?.name} {order.user?.lastname}</UserName>
                  <UserEmail>{order.user?.email}</UserEmail>
                </UserInfo>
              </MobileHide>
              <Total>{order.total.toFixed(2)} €</Total>
              <MobileHide>
                <Date>{new Date(order.createdAt).toLocaleDateString("es-ES")}</Date>
              </MobileHide>
              <StatusSelect
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </StatusSelect>
            </TableRow>
          ))}
        </Table>
      )}
    </>
  );
};

export default ManageOrders;