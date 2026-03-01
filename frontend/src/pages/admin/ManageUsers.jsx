import { useState, useCallback } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import api from "../../services/auth.service";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/ui/Loader";

// ── Styled Components (consistente con ManageOrders/ManageProducts) ──
const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: var(--spacing-xl);
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: var(--spacing-sm);
`;
const Title = styled.h1`
  font-size: var(--font-size-xl); font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.04em;
`;
const StatsRow = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;
const StatCard = styled.div`
  background: white; border: 1px solid var(--color-border);
  border-radius: var(--radius-lg); padding: var(--spacing-lg);
  display: flex; align-items: center; gap: var(--spacing-md);
`;
const StatIcon = styled.div`
  width: 44px; height: 44px; border-radius: 50%; background: #111827;
  display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;
`;
const StatInfo = styled.div``;
const StatValue = styled.p`font-size: 1.6rem; font-weight: 800; line-height: 1;`;
const StatLabel = styled.p`font-size: 0.72rem; color: var(--color-text-muted); margin-top: 0.2rem; text-transform: uppercase; letter-spacing: 0.06em;`;

const SearchBar = styled.input`
  width: 100%; padding: 0.7rem 1rem;
  border: 1px solid var(--color-border); border-radius: var(--radius-md);
  font-size: 0.88rem; font-family: var(--font-family);
  margin-bottom: var(--spacing-md);
  &:focus { outline: none; border-color: var(--color-primary); }
`;

const Table = styled.div`
  background: white; border: 1px solid var(--color-border);
  border-radius: var(--radius-lg); overflow: hidden;
`;
const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 100px 80px 120px;
  padding: 0.75rem var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  font-size: 0.7rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--color-text-muted);
  @media (max-width: 768px) { grid-template-columns: 1fr 100px 120px; }
`;
const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 100px 80px 120px;
  padding: 0.75rem var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  align-items: center; gap: var(--spacing-sm);
  transition: var(--transition);
  &:last-child { border-bottom: none; }
  &:hover { background: var(--color-bg-secondary); }
  @media (max-width: 768px) { grid-template-columns: 1fr 100px 120px; }
`;

const UserInfo = styled.div`display: flex; align-items: center; gap: var(--spacing-sm);`;
const Avatar = styled.div`
  width: 34px; height: 34px; border-radius: 50%; background: #111827;
  color: white; display: flex; align-items: center; justify-content: center;
  font-size: 0.82rem; font-weight: 700; flex-shrink: 0;
`;
const UserName  = styled.p`font-size: 0.85rem; font-weight: 700;`;
const UserEmail = styled.p`font-size: 0.72rem; color: var(--color-text-muted);`;
const UserDate  = styled.p`font-size: 0.75rem; color: var(--color-text-muted);`;

const MobileHide = styled.div`@media (max-width: 768px) { display: none; }`;

const RoleBadge = styled.span`
  display: inline-block; padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full); font-size: 0.65rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em;
  background: ${({ $admin }) => $admin ? "var(--color-accent)" : "#f3f4f6"};
  color: ${({ $admin }) => $admin ? "white" : "#374151"};
`;

const Actions = styled.div`display: flex; gap: 0.4rem; align-items: center;`;
const ActionBtn = styled.button`
  width: 30px; height: 30px; border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.82rem; transition: var(--transition);
  &:hover {
    border-color: ${({ $danger }) => $danger ? "var(--color-danger)" : "var(--color-primary)"};
    background: ${({ $danger }) => $danger ? "rgba(220,38,38,0.06)" : "var(--color-bg-secondary)"};
  }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const RoleSelect = styled.select`
  background: ${({ $admin }) => $admin ? "#fef3c7" : "#f3f4f6"};
  color: ${({ $admin }) => $admin ? "#92400e" : "#374151"};
  border: 1.5px solid ${({ $admin }) => $admin ? "#fcd34d" : "var(--color-border)"};
  border-radius: var(--radius-md);
  padding: 0.35rem 0.5rem;
  font-size: 0.72rem; font-weight: 700;
  font-family: var(--font-family); cursor: pointer;
  &:focus { outline: none; }
`;

const Empty = styled.p`text-align: center; padding: var(--spacing-2xl); color: var(--color-text-muted);`;

const ManageUsers = () => {
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);

  const fetchFn = useCallback(() => api.get("/users").then(r => r.data), []);
  const { data, loading, setData } = useFetch(fetchFn, []);
  const users = data?.users || [];

  const filtered = users.filter(u =>
    `${u.name} ${u.lastname} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalAdmins = users.filter(u => u.role === "admin").length;
  const thisMonth   = users.filter(u => {
    const d = new Date(u.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const handleRoleChange = async (userId, role) => {
    setUpdating(userId);
    setData(prev => ({ ...prev, users: prev.users.map(u => u._id === userId ? { ...u, role } : u) }));
    try {
      await api.put(`/users/${userId}/role`, { role });
      toast.success(`Rol actualizado a ${role === "admin" ? "⭐ Admin" : "Usuario"}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al actualizar rol");
      // revert
      setData(prev => ({ ...prev, users: prev.users.map(u => u._id === userId ? { ...u, role: role === "admin" ? "user" : "admin" } : u) }));
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`¿Eliminar al usuario "${name}"? Esta acción no se puede deshacer.`)) return;
    setData(prev => ({ ...prev, users: prev.users.filter(u => u._id !== userId) }));
    try {
      await api.delete(`/users/${userId}`);
      toast.success("Usuario eliminado correctamente");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al eliminar usuario");
    }
  };

  return (
    <>
      <Header>
        <Title>👥 Gestión de usuarios</Title>
      </Header>

      <StatsRow>
        <StatCard>
          <StatIcon>👥</StatIcon>
          <StatInfo>
            <StatValue>{users.length}</StatValue>
            <StatLabel>Usuarios totales</StatLabel>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon>⭐</StatIcon>
          <StatInfo>
            <StatValue>{totalAdmins}</StatValue>
            <StatLabel>Administradores</StatLabel>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon>🆕</StatIcon>
          <StatInfo>
            <StatValue>{thisMonth}</StatValue>
            <StatLabel>Nuevos este mes</StatLabel>
          </StatInfo>
        </StatCard>
      </StatsRow>

      <SearchBar
        placeholder="🔍 Buscar por nombre o email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {loading ? <Loader /> : filtered.length === 0 ? (
        <Empty>No se encontraron usuarios</Empty>
      ) : (
        <Table>
          <TableHeader>
            <span>Usuario</span>
            <MobileHide><span>Email</span></MobileHide>
            <span>Rol</span>
            <MobileHide><span>Registro</span></MobileHide>
            <span>Acciones</span>
          </TableHeader>
          {filtered.map(u => (
            <TableRow key={u._id}>
              <UserInfo>
                <Avatar>{u.name?.[0]?.toUpperCase()}</Avatar>
                <div>
                  <UserName>{u.name} {u.lastname}</UserName>
                  <UserDate>{u.city || "—"}</UserDate>
                </div>
              </UserInfo>
              <MobileHide>
                <UserEmail>{u.email}</UserEmail>
              </MobileHide>
              <RoleSelect
                $admin={u.role === "admin"}
                value={u.role}
                onChange={e => handleRoleChange(u._id, e.target.value)}
                disabled={updating === u._id}
              >
                <option value="user">👤 Usuario</option>
                <option value="admin">⭐ Admin</option>
              </RoleSelect>
              <MobileHide>
                <UserDate>{new Date(u.createdAt).toLocaleDateString("es-ES")}</UserDate>
              </MobileHide>
              <Actions>
                <ActionBtn
                  $danger
                  onClick={() => handleDelete(u._id, `${u.name} ${u.lastname}`)}
                  disabled={updating === u._id}
                  title="Eliminar usuario"
                >
                  🗑️
                </ActionBtn>
              </Actions>
            </TableRow>
          ))}
        </Table>
      )}
    </>
  );
};

export default ManageUsers;