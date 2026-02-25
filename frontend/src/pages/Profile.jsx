import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getMyOrdersService } from "../services/order.service";
import { updateMeService } from "../services/auth.service";
import useFetch from "../hooks/useFetch";
import Loader from "../components/ui/Loader";

const Header = styled.div`
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: var(--spacing-sm);
  margin-bottom: var(--spacing-2xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`font-size: var(--font-size-xl); font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;`;

const AdminLink = styled(Link)`
  background: var(--color-accent);
  color: white;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  transition: var(--transition);
  &:hover { background: var(--color-accent-dark); }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
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
  background: #111827;
  color: white;
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const CardBody = styled.div`padding: var(--spacing-lg);`;

const Avatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #111827;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 auto var(--spacing-md);
`;

const UserName = styled.h2`font-size: var(--font-size-lg); font-weight: 800; text-align: center;`;
const UserEmail = styled.p`font-size: 0.82rem; color: var(--color-text-muted); text-align: center; margin-top: 0.2rem;`;
const UserRole = styled.span`
  display: block;
  width: fit-content;
  background: ${({ $admin }) => $admin ? "var(--color-accent)" : "#111827"};
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0.5rem auto 0;
`;

const Form = styled.form`display: flex; flex-direction: column; gap: var(--spacing-md); margin-top: var(--spacing-lg);`;
const Field = styled.div`display: flex; flex-direction: column; gap: var(--spacing-xs);`;
const Label = styled.label`font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-text-muted);`;
const Input = styled.input`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.65rem 0.9rem;
  font-size: 0.9rem;
  color: var(--color-text);
  transition: var(--transition);
  &:focus { outline: none; border-color: var(--color-primary); background: white; }
`;

const SaveBtn = styled.button`
  background: #111827;
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.7rem;
  border-radius: var(--radius-md);
  transition: var(--transition);
  &:hover:not(:disabled) { background: var(--color-accent); }
  &:disabled { opacity: 0.5; }
`;

const LogoutBtn = styled.button`
  width: 100%;
  background: transparent;
  color: var(--color-danger);
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.7rem;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--color-danger);
  margin-top: var(--spacing-sm);
  transition: var(--transition);
  &:hover { background: var(--color-danger); color: white; }
`;

const OrdersTable = styled.div`display: flex; flex-direction: column; gap: var(--spacing-sm);`;
const OrderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 100px 100px 110px;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: white;
  font-size: 0.85rem;
  gap: var(--spacing-sm);
  @media (max-width: 640px) { grid-template-columns: 1fr 1fr; }
`;
const OrderId = styled.p`font-weight: 700; font-size: 0.78rem; color: var(--color-text-muted);`;
const OrderDate = styled.p`font-size: 0.8rem; color: var(--color-text-muted);`;
const OrderTotal = styled.p`font-weight: 800;`;
const StatusBadge = styled.span`
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 700;
  background: ${({ $status }) => ({
    pending: "#fef3c7", processing: "#dbeafe", shipped: "#ede9fe",
    delivered: "#dcfce7", cancelled: "#fee2e2"
  }[$status] || "#f3f4f6")};
  color: ${({ $status }) => ({
    pending: "#92400e", processing: "#1e40af", shipped: "#5b21b6",
    delivered: "#166534", cancelled: "#991b1b"
  }[$status] || "#374151")};
`;

const statusLabels = {
  pending: "Pendiente", processing: "Procesando", shipped: "Enviado",
  delivered: "Entregado", cancelled: "Cancelado"
};

const Empty = styled.p`color: var(--color-text-muted); font-size: 0.88rem; text-align: center; padding: var(--spacing-xl);`;

const Profile = () => {
  const { user, isAdmin, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const { data, loading } = useFetch(getMyOrdersService, []);
  const orders = data?.orders || [];

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: user?.name,
      lastname: user?.lastname,
      city: user?.city,
      phone: user?.phone
    }
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

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Sesión cerrada 👋");
  };

  return (
    <>
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
                <LogoutBtn type="button" onClick={handleLogout}>
                  🚪 Cerrar sesión
                </LogoutBtn>
              </Form>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>Mis pedidos ({orders.length})</CardHeader>
          <CardBody>
            {loading ? <Loader /> : orders.length === 0 ? (
              <Empty>
                Aún no tienes pedidos.{" "}
                <Link to="/products" style={{ fontWeight: 700 }}>¡Compra tu primera camiseta!</Link>
              </Empty>
            ) : (
              <OrdersTable>
                {orders.map(order => (
                  <OrderRow key={order._id}>
                    <div>
                      <OrderId>#{order._id.slice(-8).toUpperCase()}</OrderId>
                      <OrderDate>{new Date(order.createdAt).toLocaleDateString("es-ES")}</OrderDate>
                    </div>
                    <OrderTotal>{order.total?.toFixed(2)} €</OrderTotal>
                    <p style={{ fontSize: "0.8rem" }}>
                      {order.items?.length} camiseta{order.items?.length !== 1 ? "s" : ""}
                    </p>
                    <StatusBadge $status={order.status}>
                      {statusLabels[order.status] || order.status}
                    </StatusBadge>
                  </OrderRow>
                ))}
              </OrdersTable>
            )}
          </CardBody>
        </Card>
      </Layout>
    </>
  );
};

export default Profile;