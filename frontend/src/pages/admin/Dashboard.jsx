import { Link } from "react-router-dom";
import styled from "styled-components";
import { getAllProductsService } from "../../services/product.service";
import { getAllOrdersService } from "../../services/order.service";
import { getAllUsersService } from "../../services/auth.service";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/ui/Loader";

const Header = styled.div`
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: var(--spacing-sm);
  margin-bottom: var(--spacing-2xl);
`;

const Title = styled.h1`
  font-size: var(--font-size-xl);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  border-top: 3px solid ${({ $color }) => $color || "#111827"};
`;

const StatIcon = styled.p`font-size: 1.8rem; margin-bottom: var(--spacing-sm);`;
const StatNumber = styled.p`font-size: 2rem; font-weight: 800; letter-spacing: -0.03em;`;
const StatLabel = styled.p`font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-text-muted); margin-top: 0.2rem;`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const ActionCard = styled(Link)`
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  transition: var(--transition);
  &:hover { border-color: var(--color-primary); transform: translateY(-2px); box-shadow: var(--shadow-md); }
`;

const ActionIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  background: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const ActionInfo = styled.div``;
const ActionTitle = styled.h3`font-size: var(--font-size-lg); font-weight: 800;`;
const ActionDesc = styled.p`font-size: 0.82rem; color: var(--color-text-muted); margin-top: 0.2rem;`;

const Dashboard = () => {
  const { data: productsData, loading: lp } = useFetch(getAllProductsService, []);
  const { data: ordersData, loading: lo } = useFetch(getAllOrdersService, []);
  const { data: usersData, loading: lu } = useFetch(getAllUsersService, []);

  const totalProducts = productsData?.products?.length || 0;
  const totalOrders = ordersData?.orders?.length || 0;
  const totalUsers = usersData?.users?.length || 0;
  const totalRevenue = ordersData?.orders?.reduce((acc, o) => acc + o.total, 0) || 0;

  return (
    <>
      <Header>
        <Title>⚽ Panel de administración</Title>
      </Header>

      {lp || lo || lu ? <Loader /> : (
        <StatsGrid>
          <StatCard $color="#111827">
            <StatIcon>👕</StatIcon>
            <StatNumber>{totalProducts}</StatNumber>
            <StatLabel>Camisetas</StatLabel>
          </StatCard>
          <StatCard $color="var(--color-accent)">
            <StatIcon>🛒</StatIcon>
            <StatNumber>{totalOrders}</StatNumber>
            <StatLabel>Pedidos</StatLabel>
          </StatCard>
          <StatCard $color="#16a34a">
            <StatIcon>👥</StatIcon>
            <StatNumber>{totalUsers}</StatNumber>
            <StatLabel>Usuarios</StatLabel>
          </StatCard>
          <StatCard $color="var(--color-gold)">
            <StatIcon>💰</StatIcon>
            <StatNumber>{totalRevenue.toFixed(0)}€</StatNumber>
            <StatLabel>Ingresos</StatLabel>
          </StatCard>
        </StatsGrid>
      )}

      <ActionsGrid>
        <ActionCard to="/admin/products">
          <ActionIcon>👕</ActionIcon>
          <ActionInfo>
            <ActionTitle>Gestionar camisetas</ActionTitle>
            <ActionDesc>Añadir, editar y eliminar camisetas del catálogo</ActionDesc>
          </ActionInfo>
        </ActionCard>
        <ActionCard to="/admin/orders">
          <ActionIcon>🛒</ActionIcon>
          <ActionInfo>
            <ActionTitle>Gestionar pedidos</ActionTitle>
            <ActionDesc>Ver y actualizar el estado de los pedidos</ActionDesc>
          </ActionInfo>
        </ActionCard>
      </ActionsGrid>
    </>
  );
};

export default Dashboard;