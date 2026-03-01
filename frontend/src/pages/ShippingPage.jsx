import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrap = styled.div`
  max-width: 860px; margin: 0 auto;
  padding: var(--spacing-3xl) var(--spacing-xl);
  @media (max-width: 768px) { padding: var(--spacing-2xl) var(--spacing-md); }
`;
const Header = styled.div`
  text-align: center; margin-bottom: var(--spacing-3xl);
  border-bottom: 2px solid var(--color-primary); padding-bottom: var(--spacing-lg);
`;
const Title = styled.h1`font-size: var(--font-size-2xl); font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;`;
const Subtitle = styled.p`color: var(--color-text-muted); margin-top: var(--spacing-xs); font-size: 0.95rem;`;

const Grid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-xl);
  margin-bottom: var(--spacing-3xl);
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;
const Card = styled.div`
  background: white; border: 1px solid var(--color-border);
  border-radius: var(--radius-lg); padding: var(--spacing-xl);
`;
const CardIcon = styled.div`font-size: 2rem; margin-bottom: var(--spacing-md);`;
const CardTitle = styled.h2`font-size: 1rem; font-weight: 800; margin-bottom: var(--spacing-sm); text-transform: uppercase; letter-spacing: 0.04em;`;
const CardText = styled.p`font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.7;`;

const Section = styled.div`margin-bottom: var(--spacing-3xl);`;
const SectionTitle = styled.h2`
  font-size: var(--font-size-lg); font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.04em; margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm); border-bottom: 1px solid var(--color-border);
`;

const Table = styled.table`
  width: 100%; border-collapse: collapse; font-size: 0.88rem;
  th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--color-border); }
  th { background: var(--color-bg-secondary); font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-text-muted); }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--color-bg-secondary); }
`;

const Badge = styled.span`
  display: inline-block; padding: 0.2rem 0.6rem; border-radius: var(--radius-full);
  font-size: 0.72rem; font-weight: 700;
  background: ${({ $type }) => $type === "free" ? "#dcfce7" : $type === "fast" ? "#fef3c7" : "#f3f4f6"};
  color: ${({ $type }) => $type === "free" ? "#166534" : $type === "fast" ? "#92400e" : "#374151"};
`;

const StepList = styled.div`display: flex; flex-direction: column; gap: var(--spacing-md);`;
const Step = styled.div`
  display: flex; gap: var(--spacing-md); align-items: flex-start;
`;
const StepNum = styled.div`
  width: 32px; height: 32px; border-radius: 50%; background: #111827; color: white;
  font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 2px;
`;
const StepContent = styled.div``;
const StepTitle = styled.p`font-weight: 700; font-size: 0.9rem; margin-bottom: 0.2rem;`;
const StepText = styled.p`font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.6;`;

const AlertBox = styled.div`
  background: #fef3c7; border: 1px solid #f59e0b; border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg); font-size: 0.88rem; color: #92400e;
  line-height: 1.6; margin-bottom: var(--spacing-xl);
`;

const ContactLink = styled(Link)`
  display: inline-flex; align-items: center; gap: 0.4rem;
  background: #111827; color: white; font-weight: 700; font-size: 0.88rem;
  padding: 0.75rem 1.5rem; border-radius: var(--radius-md); transition: var(--transition);
  &:hover { background: var(--color-accent); }
`;

const ShippingPage = () => (
  <Wrap>
    <Header>
      <Title>Envíos y Devoluciones</Title>
      <Subtitle>Todo lo que necesitas saber sobre el envío de tu pedido y nuestras políticas de devolución</Subtitle>
    </Header>

    <Grid>
      <Card>
        <CardIcon>🚚</CardIcon>
        <CardTitle>Envío gratuito</CardTitle>
        <CardText>En pedidos superiores a <strong>75€</strong>. Para pedidos menores, el envío tiene un coste de <strong>4,99€</strong>.</CardText>
      </Card>
      <Card>
        <CardIcon>📦</CardIcon>
        <CardTitle>Plazo de entrega</CardTitle>
        <CardText>Entre <strong>7 y 15 días laborables</strong> para toda España. Las camisetas personalizadas pueden tardar algo más.</CardText>
      </Card>
      <Card>
        <CardIcon>↩️</CardIcon>
        <CardTitle>30 días para devolver</CardTitle>
        <CardText>Tienes <strong>30 días</strong> desde la recepción para solicitar una devolución. Las camisetas personalizadas no son devolvibles.</CardText>
      </Card>
      <Card>
        <CardIcon>🔒</CardIcon>
        <CardTitle>Envío seguro</CardTitle>
        <CardText>Todos los pedidos se envían con <strong>número de seguimiento</strong> para que puedas rastrear tu paquete en todo momento.</CardText>
      </Card>
    </Grid>

    <Section>
      <SectionTitle>📋 Tarifas de envío</SectionTitle>
      <Table>
        <thead>
          <tr>
            <th>Destino</th>
            <th>Plazo</th>
            <th>Coste</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>España peninsular</td>
            <td>7-15 días laborables</td>
            <td><Badge $type="free">Gratis desde 75€</Badge> / 4,99€</td>
          </tr>
          <tr>
            <td>Islas Baleares</td>
            <td>7-15 días laborables</td>
            <td>7,99€</td>
          </tr>
          <tr>
            <td>Islas Canarias</td>
            <td>10-20 días laborables</td>
            <td>9,99€</td>
          </tr>
          <tr>
            <td>Ceuta y Melilla</td>
            <td>10-20 días laborables</td>
            <td>9,99€</td>
          </tr>
          <tr>
            <td>Portugal</td>
            <td>10-15 días laborables</td>
            <td>6,99€</td>
          </tr>
          <tr>
            <td>Resto de Europa</td>
            <td>15-20 días laborables</td>
            <td>12,99€</td>
          </tr>
        </tbody>
      </Table>
    </Section>

    <Section>
      <SectionTitle>↩️ Proceso de devolución</SectionTitle>
      <AlertBox>
        ⚠️ <strong>Importante:</strong> Las camisetas con personalización (nombre, número o parches) no son elegibles para devolución salvo defecto de fabricación.
      </AlertBox>
      <StepList>
        <Step>
          <StepNum>1</StepNum>
          <StepContent>
            <StepTitle>Contacta con nosotros</StepTitle>
            <StepText>Escríbenos a <strong>inf.retrofutbol@gmail.com</strong> o usa el formulario de contacto indicando tu número de pedido y el motivo de la devolución.</StepText>
          </StepContent>
        </Step>
        <Step>
          <StepNum>2</StepNum>
          <StepContent>
            <StepTitle>Recibe la etiqueta de envío</StepTitle>
            <StepText>En menos de 48h te enviaremos una etiqueta de devolución prepagada a tu email.</StepText>
          </StepContent>
        </Step>
        <Step>
          <StepNum>3</StepNum>
          <StepContent>
            <StepTitle>Empaqueta y envía</StepTitle>
            <StepText>Empaqueta la camiseta en su estado original (sin lavar, con etiquetas) y llévala a cualquier oficina de correos.</StepText>
          </StepContent>
        </Step>
        <Step>
          <StepNum>4</StepNum>
          <StepContent>
            <StepTitle>Reembolso en 5-7 días</StepTitle>
            <StepText>Una vez recibida y revisada la camiseta, procesamos el reembolso en el mismo método de pago en un plazo de 5-7 días laborables.</StepText>
          </StepContent>
        </Step>
      </StepList>
    </Section>

    <Section>
      <SectionTitle>❓ Preguntas frecuentes</SectionTitle>
      <Table>
        <tbody>
          <tr>
            <td><strong>¿Puedo cambiar una talla?</strong></td>
            <td>Sí, los cambios de talla están permitidos dentro de los 30 días siempre que la prenda no esté personalizada.</td>
          </tr>
          <tr>
            <td><strong>¿Qué pasa si llega dañada?</strong></td>
            <td>Contáctanos con fotos del desperfecto y lo gestionamos de inmediato sin coste alguno para ti.</td>
          </tr>
          <tr>
            <td><strong>¿Puedo seguir mi pedido?</strong></td>
            <td>Sí, recibirás un email con el número de seguimiento cuando tu pedido sea enviado.</td>
          </tr>
          <tr>
            <td><strong>¿Envían a Latinoamérica?</strong></td>
            <td>De momento solo enviamos a España y Europa. Estamos trabajando para ampliar destinos próximamente.</td>
          </tr>
        </tbody>
      </Table>
    </Section>

    <div style={{ textAlign: "center", paddingTop: "var(--spacing-lg)" }}>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--spacing-md)", fontSize: "0.9rem" }}>
        ¿Tienes alguna duda sobre tu pedido?
      </p>
      <ContactLink to="/contact">📧 Contactar con nosotros</ContactLink>
    </div>
  </Wrap>
);

export default ShippingPage;