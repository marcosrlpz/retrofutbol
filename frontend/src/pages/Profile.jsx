import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getMyOrdersService, cancelOrderService, markAsDeliveredService } from "../services/order.service";
import { updateMeService } from "../services/auth.service";
import useFetch from "../hooks/useFetch";
import Loader from "../components/ui/Loader";
import OrderDetail from "../components/ui/OrderDetail";

const Header = styled.div`
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: var(--spacing-sm);
  margin-bottom: var(--spacing-2xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
`;
const Title = styled.h1`
  font-size: var(--font-size-xl);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  @media (max-width: 480px) { font-size: var(--font-size-lg); }
`;
const AdminLink = styled(Link)`
  background: var(--color-accent); color: white; font-size: 0.78rem; font-weight: 700;
  padding: 0.5rem 1rem; border-radius: var(--radius-md); transition: var(--transition);
  &:hover { background: var(--color-accent-dark); }
`;
const Layout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--spacing-2xl);
  align-items: start;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;
const Card = styled.div`
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
`;
const CardHeader = styled.div`
  background: #111827; color: white; padding: var(--spacing-md) var(--spacing-lg);
  font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
`;
const CardBody = styled.div`padding: var(--spacing-lg);`;
const Avatar = styled.div`
  width: 72px; height: 72px; border-radius: 50%; background: #111827; color: white;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.8rem; font-weight: 800; margin: 0 auto var(--spacing-md);
`;
const UserName  = styled.h2`font-size: var(--font-size-lg); font-weight: 800; text-align: center;`;
const UserEmail = styled.p`font-size: 0.82rem; color: var(--color-text-muted); text-align: center; margin-top: 0.2rem; word-break: break-all;`;
const UserRole  = styled.span`
  display: block; width: fit-content;
  background: ${({ $admin }) => $admin ? "var(--color-accent)" : "#111827"};
  color: white; font-size: 0.65rem; font-weight: 700;
  padding: 0.2rem 0.6rem; border-radius: var(--radius-full);
  text-transform: uppercase; letter-spacing: 0.06em; margin: 0.5rem auto 0;
`;
const Form  = styled.form`display: flex; flex-direction: column; gap: var(--spacing-md); margin-top: var(--spacing-lg);`;
const Field = styled.div`display: flex; flex-direction: column; gap: var(--spacing-xs);`;
const Label = styled.label`font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-text-muted);`;
const Input = styled.input`
  background: var(--color-bg-secondary); border: 1px solid var(--color-border);
  border-radius: var(--radius-md); padding: 0.65rem 0.9rem;
  font-size: 0.9rem; color: var(--color-text); transition: var(--transition); width: 100%;
  &:focus { outline: none; border-color: var(--color-primary); background: white; }
`;
const SaveBtn = styled.button`
  background: #111827; color: white; font-size: 0.85rem; font-weight: 700;
  padding: 0.7rem; border-radius: var(--radius-md); transition: var(--transition); width: 100%;
  &:hover:not(:disabled) { background: var(--color-accent); } &:disabled { opacity: 0.5; }
`;
const LogoutBtn = styled.button`
  width: 100%; background: transparent; color: var(--color-danger);
  font-size: 0.85rem; font-weight: 700; padding: 0.7rem; border-radius: var(--radius-md);
  border: 1.5px solid var(--color-danger); margin-top: var(--spacing-sm); transition: var(--transition);
  &:hover { background: var(--color-danger); color: white; }
`;

const TabsRow = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--color-border);
  margin-bottom: var(--spacing-lg);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;
const Tab = styled.button`
  padding: 0.65rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border: none;
  background: none;
  cursor: pointer;
  white-space: nowrap;
  color: ${({ $active }) => $active ? "var(--color-primary)" : "var(--color-text-muted)"};
  border-bottom: 2px solid ${({ $active }) => $active ? "var(--color-primary)" : "transparent"};
  margin-bottom: -2px;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
  &:hover { color: var(--color-primary); }
`;
const TabCount = styled.span`
  background: ${({ $active }) => $active ? "var(--color-primary)" : "#e5e7eb"};
  color: ${({ $active }) => $active ? "white" : "var(--color-text-muted)"};
  font-size: 0.65rem; font-weight: 700;
  padding: 0.1rem 0.45rem; border-radius: 999px; transition: var(--transition);
`;

const OrdersTable = styled.div`display: flex; flex-direction: column; gap: var(--spacing-sm);`;

const OrderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: white;
  cursor: pointer;
  transition: var(--transition);
  &:hover { border-color: var(--color-accent); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
`;

const OrderLeft = styled.div`display: flex; flex-direction: column; gap: 0.3rem;`;
const OrderRight = styled.div`display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem;`;

const OrderId    = styled.p`font-weight: 700; font-size: 0.78rem; color: var(--color-text-muted);`;
const OrderDate  = styled.p`font-size: 0.78rem; color: var(--color-text-muted);`;
const OrderTotal = styled.p`font-weight: 800; font-size: 0.95rem;`;
const OrderItems = styled.p`font-size: 0.78rem; color: var(--color-text-muted);`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.6rem; border-radius: var(--radius-full); font-size: 0.7rem; font-weight: 700;
  background: ${({ $status }) => ({ pending: "#fef3c7", processing: "#dbeafe", shipped: "#ede9fe", delivered: "#dcfce7", cancelled: "#fee2e2" }[$status] || "#f3f4f6")};
  color: ${({ $status }) => ({ pending: "#92400e", processing: "#1e40af", shipped: "#5b21b6", delivered: "#166534", cancelled: "#991b1b" }[$status] || "#374151")};
  white-space: nowrap;
`;

const ActionBtns = styled.div`display: flex; gap: 0.4rem; flex-wrap: wrap; justify-content: flex-end;`;

const CancelBtn = styled.button`
  background: transparent; color: var(--color-danger); border: 1px solid var(--color-danger);
  border-radius: var(--radius-md); font-size: 0.7rem; font-weight: 700;
  padding: 0.3rem 0.6rem; cursor: pointer; transition: var(--transition); white-space: nowrap;
  &:hover:not(:disabled) { background: var(--color-danger); color: white; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;
const ArrivedBtn = styled.button`
  background: transparent; color: #166534; border: 1px solid #86efac;
  border-radius: var(--radius-md); font-size: 0.7rem; font-weight: 700;
  padding: 0.3rem 0.6rem; cursor: pointer; transition: var(--transition); white-space: nowrap;
  &:hover:not(:disabled) { background: #dcfce7; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;
const ViewHint = styled.span`font-size: 0.68rem; color: var(--color-text-muted);`;

const Empty = styled.div`
  text-align: center; padding: var(--spacing-2xl);
  p { color: var(--color-text-muted); font-size: 0.88rem; margin-bottom: var(--spacing-md); }
`;

const statusLabels = {
  pending: "Pendiente", processing: "Procesando", shipped: "Enviado",
  delivered: "Entregado", cancelled: "Cancelado"
};

const TABS = [
  { key: "active",    label: "En curso",    emoji: "🚚", statuses: ["pending", "processing", "shipped"] },
  { key: "delivered", label: "Finalizados", emoji: "✅", statuses: ["delivered"] },
  { key: "cancelled", label: "Cancelados",  emoji: "❌", statuses: ["cancelled"] },
];

const Profile = () => {
  const { user, isAdmin, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const { data, setData, loading } = useFetch(getMyOrdersService, []);
  const orders = data?.orders || [];
  const [cancelling, setCancelling] = useState(null);
  const [arriving, setArriving]     = useState(null);
  const [activeTab, setActiveTab]   = useState("active");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { name: user?.name, lastname: user?.lastname, city: user?.city, phone: user?.phone }
  });

  const onSubmit = async (formData) => {
    try {
      const res = await updateMeService(formData);
      updateUser(res.user);
      toast.success("Perfil actualizado ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al actualizar");
    }
  };

  const handleLogout = () => { logout(); navigate("/"); toast.success("Sesión cerrada 👋"); };

  const handleCancel = async (e, orderId) => {
    e.stopPropagation();
    if (!window.confirm("¿Seguro que quieres cancelar este pedido?")) return;
    setCancelling(orderId);
    setData(prev => ({ ...prev, orders: prev.orders.map(o => o._id === orderId ? { ...o, status: "cancelled" } : o) }));
    try {
      await cancelOrderService(orderId);
      toast.success("Pedido cancelado");
    } catch {
      setData(prev => ({ ...prev, orders: prev.orders.map(o => o._id === orderId ? { ...o, status: "pending" } : o) }));
      toast.error("No se pudo cancelar el pedido");
    } finally { setCancelling(null); }
  };

  const handleArrived = async (e, orderId) => {
    e.stopPropagation();
    if (!window.confirm("¿Confirmas que has recibido el pedido?")) return;
    setArriving(orderId);
    setData(prev => ({ ...prev, orders: prev.orders.map(o => o._id === orderId ? { ...o, status: "delivered" } : o) }));
    try {
      await markAsDeliveredService(orderId);
      toast.success("¡Pedido marcado como recibido! ✅");
    } catch {
      setData(prev => ({ ...prev, orders: prev.orders.map(o => o._id === orderId ? { ...o, status: "shipped" } : o) }));
      toast.error("No se pudo actualizar el pedido");
    } finally { setArriving(null); }
  };

  const canCancel = (status) => ["pending", "processing"].includes(status);
  const canArrive = (status) => status === "shipped";
  const filteredOrders = orders.filter(o => TABS.find(t => t.key === activeTab)?.statuses.includes(o.status));
  const countFor = (key) => orders.filter(o => TABS.find(t => t.key === key)?.statuses.includes(o.status)).length;

  return (
    <>
      {selectedOrder && <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
      <Header>
        <Title>Mi cuenta</Title>
        {isAdmin && <AdminLink to="/admin">⚙️ Panel admin</AdminLink>}
      </Header>
      <Layout>
        <div>
          <Card>
            <CardHeader>Mi perfil</CardHeader>
            <CardBody>
              <Avatar>{user?.name?.[0]?.toUpperCase()}</Avatar>
              <UserName>{user?.name} {user?.lastname}</UserName>
              <UserEmail>{user?.email}</UserEmail>
              <UserRole $admin={isAdmin}>{isAdmin ? "⭐ Admin" : "Usuario"}</UserRole>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Field><Label>Nombre</Label><Input {...register("name")} /></Field>
                <Field><Label>Apellidos</Label><Input {...register("lastname")} /></Field>
                <Field><Label>Ciudad</Label><Input {...register("city")} /></Field>
                <Field><Label>Teléfono</Label><Input {...register("phone")} /></Field>
                <SaveBtn type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : "Guardar cambios"}
                </SaveBtn>
                <LogoutBtn type="button" onClick={handleLogout}>🚪 Cerrar sesión</LogoutBtn>
              </Form>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>Mis pedidos ({orders.length})</CardHeader>
          <CardBody>
            {loading ? <Loader /> : (
              <>
                <TabsRow>
                  {TABS.map(tab => (
                    <Tab key={tab.key} $active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)}>
                      {tab.emoji} {tab.label}
                      <TabCount $active={activeTab === tab.key}>{countFor(tab.key)}</TabCount>
                    </Tab>
                  ))}
                </TabsRow>

                {filteredOrders.length === 0 ? (
                  <Empty>
                    <p>
                      {activeTab === "active"    && "No tienes pedidos en curso."}
                      {activeTab === "delivered" && "Aún no tienes pedidos finalizados."}
                      {activeTab === "cancelled" && "No tienes pedidos cancelados."}
                    </p>
                    {activeTab === "active" && (
                      <Link to="/products" style={{ fontWeight: 700, color: "var(--color-accent)" }}>
                        ¡Compra tu primera camiseta! →
                      </Link>
                    )}
                  </Empty>
                ) : (
                  <OrdersTable>
                    {filteredOrders.map(order => (
                      <OrderRow key={order._id} onClick={() => setSelectedOrder(order)}>
                        <OrderLeft>
                          <OrderId>#{order._id.slice(-8).toUpperCase()}</OrderId>
                          <OrderDate>{new Date(order.createdAt).toLocaleDateString("es-ES")}</OrderDate>
                          <OrderItems>{order.items?.length} camiseta{order.items?.length !== 1 ? "s" : ""}</OrderItems>
                          <ActionBtns onClick={e => e.stopPropagation()}>
                            {canCancel(order.status) && (
                              <CancelBtn onClick={(e) => handleCancel(e, order._id)} disabled={cancelling === order._id}>
                                {cancelling === order._id ? "..." : "Cancelar"}
                              </CancelBtn>
                            )}
                            {canArrive(order.status) && (
                              <ArrivedBtn onClick={(e) => handleArrived(e, order._id)} disabled={arriving === order._id}>
                                {arriving === order._id ? "..." : "📦 Recibido"}
                              </ArrivedBtn>
                            )}
                          </ActionBtns>
                        </OrderLeft>
                        <OrderRight>
                          <OrderTotal>{order.total?.toFixed(2)} €</OrderTotal>
                          <StatusBadge $status={order.status}>
                            {statusLabels[order.status] || order.status}
                          </StatusBadge>
                          <ViewHint>👁 Ver detalle</ViewHint>
                        </OrderRight>
                      </OrderRow>
                    ))}
                  </OrdersTable>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </Layout>
    </>
  );
};

export default Profile;