import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { getAllProductsService } from "../../services/product.service";
import { getAllOrdersService } from "../../services/order.service";
import { getAllUsersService } from "../../services/auth.service";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/ui/Loader";

// ── Styled Components ─────────────────────────────────────────────────
const Header = styled.div`
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: var(--spacing-sm);
  margin-bottom: var(--spacing-2xl);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;
const Title    = styled.h1`font-size: var(--font-size-xl); font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;`;
const Subtitle = styled.p`font-size: 0.78rem; color: var(--color-text-muted);`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
`;
const StatCard   = styled.div`
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  border-top: 3px solid ${({ $color }) => $color || "#111827"};
`;
const StatIcon   = styled.p`font-size: 1.8rem; margin-bottom: var(--spacing-sm);`;
const StatNumber = styled.p`font-size: 2rem; font-weight: 800; letter-spacing: -0.03em;`;
const StatLabel  = styled.p`font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-text-muted); margin-top: 0.2rem;`;
const StatSub    = styled.p`font-size: 0.72rem; color: var(--color-text-muted); margin-top: 0.4rem;`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;
const ThreeCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const Card       = styled.div`background: white; border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden;`;
const CardHeader = styled.div`display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-lg); border-bottom: 1px solid var(--color-border);`;
const CardTitle  = styled.h3`font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;`;
const CardLink   = styled(Link)`font-size: 0.72rem; font-weight: 700; color: var(--color-accent); &:hover { text-decoration: underline; }`;

// ── Pedidos recientes ─────────────────────────────────────────────────
const OrderRow   = styled.div`
  display: grid;
  grid-template-columns: 1fr 80px 100px;
  padding: 0.7rem var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  align-items: center;
  font-size: 0.82rem;
  &:last-child { border-bottom: none; }
  &:hover { background: var(--color-bg-secondary); }
`;
const OrderId    = styled.p`font-weight: 700; font-size: 0.78rem;`;
const OrderUser  = styled.p`font-size: 0.72rem; color: var(--color-text-muted);`;
const OrderTotal = styled.p`font-weight: 700; font-size: 0.82rem;`;
const StatusDot  = styled.span`
  display: inline-flex; align-items: center; gap: 0.3rem;
  font-size: 0.68rem; font-weight: 700; padding: 0.2rem 0.5rem;
  border-radius: var(--radius-full);
  background: ${({ $s }) => ({
    pending: "#fef3c7", processing: "#dbeafe",
    shipped: "#ede9fe", delivered: "#dcfce7", cancelled: "#fee2e2"
  }[$s] || "#f3f4f6")};
  color: ${({ $s }) => ({
    pending: "#92400e", processing: "#1e40af",
    shipped: "#5b21b6", delivered: "#166534", cancelled: "#991b1b"
  }[$s] || "#374151")};
`;

// ── Productos más vendidos ────────────────────────────────────────────
const TopRow  = styled.div`display: flex; align-items: center; gap: var(--spacing-md); padding: 0.7rem var(--spacing-lg); border-bottom: 1px solid var(--color-border); &:last-child { border-bottom: none; }`;
const TopNum  = styled.span`font-size: 0.72rem; font-weight: 800; color: var(--color-text-muted); width: 16px;`;
const TopImg  = styled.img`width: 36px; height: 46px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--color-border);`;
const TopName = styled.p`font-size: 0.78rem; font-weight: 700; flex: 1;`;
const TopSold = styled.p`font-size: 0.72rem; color: var(--color-text-muted); white-space: nowrap;`;

// ── Distribución por estado ───────────────────────────────────────────
const StatusRow  = styled.div`display: flex; align-items: center; gap: var(--spacing-md); padding: 0.6rem var(--spacing-lg); border-bottom: 1px solid var(--color-border); &:last-child { border-bottom: none; }`;
const StatusBar  = styled.div`flex: 1; height: 6px; background: #f3f4f6; border-radius: 99px; overflow: hidden;`;
const StatusFill = styled.div`height: 100%; width: ${({ $pct }) => $pct}%; background: ${({ $color }) => $color}; border-radius: 99px; transition: width 0.6s ease;`;
const StatusName  = styled.p`font-size: 0.75rem; font-weight: 700; width: 90px;`;
const StatusCount = styled.p`font-size: 0.72rem; color: var(--color-text-muted); width: 28px; text-align: right;`;

// ── Acciones rápidas ──────────────────────────────────────────────────
const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;
const ActionCard  = styled(Link)`
  background: white; border: 1px solid var(--color-border); border-radius: var(--radius-lg);
  padding: var(--spacing-xl); display: flex; align-items: center; gap: var(--spacing-lg);
  transition: var(--transition);
  &:hover { border-color: var(--color-primary); transform: translateY(-2px); box-shadow: var(--shadow-md); }
`;
const ActionIcon  = styled.div`width: 56px; height: 56px; border-radius: var(--radius-lg); background: #111827; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;`;
const ActionTitle = styled.h3`font-size: var(--font-size-lg); font-weight: 800;`;
const ActionDesc  = styled.p`font-size: 0.82rem; color: var(--color-text-muted); margin-top: 0.2rem;`;

// ── Tooltip personalizado recharts ────────────────────────────────────
const TooltipBox = styled.div`
  background: #111827; color: white; padding: 0.5rem 0.8rem;
  border-radius: 8px; font-size: 0.78rem; font-weight: 700;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
`;
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <TooltipBox>
        <p>{label}</p>
        <p>{payload[0].value.toFixed(0)}€</p>
      </TooltipBox>
    );
  }
  return null;
};

// ── Helpers ───────────────────────────────────────────────────────────
const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const STATUS_INFO = [
  { key: "pending",    label: "Pendiente",  color: "#fbbf24" },
  { key: "processing", label: "Procesando", color: "#60a5fa" },
  { key: "shipped",    label: "Enviado",    color: "#a78bfa" },
  { key: "delivered",  label: "Entregado",  color: "#4ade80" },
  { key: "cancelled",  label: "Cancelado",  color: "#f87171" },
];
const PIE_COLORS = ["#111827","#c9a84c","#60a5fa","#4ade80","#f87171","#a78bfa","#fb923c"];

const Dashboard = () => {
  const { data: productsData, loading: lp } = useFetch(getAllProductsService, []);
  const { data: ordersData,   loading: lo } = useFetch(getAllOrdersService,   []);
  const { data: usersData,    loading: lu } = useFetch(getAllUsersService,     []);

  const loading = lp || lo || lu;

  const products = productsData?.products || [];
  const orders   = ordersData?.orders     || [];
  const users    = usersData?.users       || [];

  // Stats
  const totalRevenue  = orders.reduce((acc, o) => acc + (o.status !== "cancelled" ? o.total : 0), 0);
  const todayOrders   = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const avgOrder      = orders.length ? totalRevenue / orders.filter(o => o.status !== "cancelled").length : 0;

  // Ventas por mes (últimos 6 meses) — para recharts LineChart
  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const revenue = orders
      .filter(o => {
        const od = new Date(o.createdAt);
        return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear() && o.status !== "cancelled";
      })
      .reduce((acc, o) => acc + o.total, 0);
    return { label: MONTHS[d.getMonth()], revenue };
  });

  // Pedidos recientes
  const recentOrders = [...orders].slice(0, 6);

  // Productos más vendidos
  const soldMap = {};
  orders.filter(o => o.status !== "cancelled").forEach(o => {
    o.items?.forEach(item => {
      const id = item.product?._id || item.product;
      if (!soldMap[id]) soldMap[id] = { product: item.product, qty: 0 };
      soldMap[id].qty += item.quantity;
    });
  });
  const topProducts = Object.values(soldMap).sort((a, b) => b.qty - a.qty).slice(0, 5);

  // Distribución por estado
  const statusCounts = STATUS_INFO.map(s => ({
    ...s, count: orders.filter(o => o.status === s.key).length
  }));

  // Categorías más vendidas — para recharts PieChart
  const catMap = {};
  orders.filter(o => o.status !== "cancelled").forEach(o => {
    o.items?.forEach(item => {
      const cat = item.product?.category || "Sin categoría";
      catMap[cat] = (catMap[cat] || 0) + item.quantity;
    });
  });
  const categoryData = Object.entries(catMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  if (loading) return <Loader />;

  return (
    <>
      <Header>
        <div>
          <Title>⚽ Panel de administración</Title>
          <Subtitle>{new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</Subtitle>
        </div>
      </Header>

      {/* STATS */}
      <StatsGrid>
        <StatCard $color="#111827">
          <StatIcon>💰</StatIcon>
          <StatNumber>{totalRevenue.toFixed(0)}€</StatNumber>
          <StatLabel>Ingresos totales</StatLabel>
          <StatSub>Solo pedidos no cancelados</StatSub>
        </StatCard>
        <StatCard $color="var(--color-accent)">
          <StatIcon>🛒</StatIcon>
          <StatNumber>{orders.length}</StatNumber>
          <StatLabel>Pedidos totales</StatLabel>
          <StatSub>{todayOrders} hoy · {pendingOrders} pendientes</StatSub>
        </StatCard>
        <StatCard $color="#16a34a">
          <StatIcon>👥</StatIcon>
          <StatNumber>{users.length}</StatNumber>
          <StatLabel>Usuarios</StatLabel>
          <StatSub>{products.length} camisetas en catálogo</StatSub>
        </StatCard>
        <StatCard $color="#c9a84c">
          <StatIcon>📊</StatIcon>
          <StatNumber>{avgOrder.toFixed(0)}€</StatNumber>
          <StatLabel>Ticket medio</StatLabel>
          <StatSub>Por pedido completado</StatSub>
        </StatCard>
      </StatsGrid>

      {/* GRÁFICA LÍNEAS + PEDIDOS RECIENTES */}
      <TwoCol>
        <Card>
          <CardHeader>
            <CardTitle>📈 Ingresos últimos 6 meses</CardTitle>
          </CardHeader>
          <div style={{ padding: "1.5rem 1rem 1rem" }}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}€`} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#111827"
                  strokeWidth={2.5}
                  dot={{ fill: "#111827", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#c9a84c", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🕐 Pedidos recientes</CardTitle>
            <CardLink to="/admin/orders">Ver todos →</CardLink>
          </CardHeader>
          {recentOrders.length === 0 ? (
            <p style={{ padding: "1rem", color: "var(--color-text-muted)", fontSize: "0.82rem" }}>No hay pedidos todavía</p>
          ) : recentOrders.map(o => (
            <OrderRow key={o._id}>
              <div>
                <OrderId>#{o._id.slice(-8).toUpperCase()}</OrderId>
                <OrderUser>{o.user?.name} {o.user?.lastname}</OrderUser>
              </div>
              <OrderTotal>{o.total?.toFixed(2)}€</OrderTotal>
              <StatusDot $s={o.status}>
                {{ pending: "⏳", processing: "🔧", shipped: "🚚", delivered: "✅", cancelled: "❌" }[o.status]}
                {{ pending: "Pendiente", processing: "Procesando", shipped: "Enviado", delivered: "Entregado", cancelled: "Cancelado" }[o.status]}
              </StatusDot>
            </OrderRow>
          ))}
        </Card>
      </TwoCol>

      {/* PRODUCTOS MÁS VENDIDOS + DISTRIBUCIÓN ESTADOS + CATEGORÍAS (DONA) */}
      <ThreeCol>
        <Card>
          <CardHeader>
            <CardTitle>🏆 Más vendidos</CardTitle>
          </CardHeader>
          {topProducts.length === 0 ? (
            <p style={{ padding: "1rem", color: "var(--color-text-muted)", fontSize: "0.82rem" }}>Sin ventas todavía</p>
          ) : topProducts.map((item, i) => (
            <TopRow key={i}>
              <TopNum>#{i + 1}</TopNum>
              {item.product?.image_url && <TopImg src={item.product.image_url} alt="" />}
              <TopName>{item.product?.name || "Producto eliminado"}</TopName>
              <TopSold>{item.qty} uds</TopSold>
            </TopRow>
          ))}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📦 Estado de pedidos</CardTitle>
          </CardHeader>
          {statusCounts.map(s => (
            <StatusRow key={s.key}>
              <StatusName>{s.label}</StatusName>
              <StatusBar>
                <StatusFill $pct={orders.length ? (s.count / orders.length) * 100 : 0} $color={s.color} />
              </StatusBar>
              <StatusCount>{s.count}</StatusCount>
            </StatusRow>
          ))}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🍩 Categorías más vendidas</CardTitle>
          </CardHeader>
          {categoryData.length === 0 ? (
            <p style={{ padding: "1rem", color: "var(--color-text-muted)", fontSize: "0.82rem" }}>Sin ventas todavía</p>
          ) : (
            <div style={{ padding: "0.5rem 0" }}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} uds`, name]} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "0.7rem" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </ThreeCol>

      {/* STOCK BAJO */}
      <TwoCol>
        <Card>
          <CardHeader>
            <CardTitle>⚠️ Stock bajo</CardTitle>
            <CardLink to="/admin/products">Gestionar →</CardLink>
          </CardHeader>
          {products.filter(p => p.stock < 5).length === 0 ? (
            <p style={{ padding: "1rem", color: "var(--color-text-muted)", fontSize: "0.82rem" }}>✅ Todo el stock está bien</p>
          ) : products.filter(p => p.stock < 5).slice(0, 5).map(p => (
            <TopRow key={p._id}>
              <TopImg src={p.image_url} alt="" />
              <TopName>{p.name}</TopName>
              <TopSold style={{ color: p.stock === 0 ? "#991b1b" : "#92400e", fontWeight: 700 }}>
                {p.stock === 0 ? "Agotado" : `${p.stock} uds`}
              </TopSold>
            </TopRow>
          ))}
        </Card>
        <div />
      </TwoCol>

      {/* ACCIONES RÁPIDAS */}
      <ActionsGrid>
        <ActionCard to="/admin/products">
          <ActionIcon>👕</ActionIcon>
          <div>
            <ActionTitle>Gestionar camisetas</ActionTitle>
            <ActionDesc>Añadir, editar y eliminar camisetas del catálogo</ActionDesc>
          </div>
        </ActionCard>
        <ActionCard to="/admin/orders">
          <ActionIcon>🛒</ActionIcon>
          <div>
            <ActionTitle>Gestionar pedidos</ActionTitle>
            <ActionDesc>Ver y actualizar el estado de los pedidos</ActionDesc>
          </div>
        </ActionCard>
        <ActionCard to="/admin/users">
          <ActionIcon>👥</ActionIcon>
          <div>
            <ActionTitle>Gestionar usuarios</ActionTitle>
            <ActionDesc>Ver usuarios, cambiar roles y gestionar cuentas</ActionDesc>
          </div>
        </ActionCard>
      </ActionsGrid>
    </>
  );
};

export default Dashboard;