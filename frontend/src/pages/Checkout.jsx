import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import toast from "react-hot-toast";
import { createOrderService } from "../services/order.service";
import useCart from "../hooks/useCart";

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
  @media (max-width: 480px) { font-size: var(--font-size-lg); }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: var(--spacing-2xl);
  align-items: start;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

/* En móvil el resumen va PRIMERO visualmente */
const SummaryWrapper = styled.div`
  @media (max-width: 1024px) {
    order: -1;
  }
`;

const Form = styled.form`display: flex; flex-direction: column; gap: var(--spacing-xl);`;

const Section = styled.div`
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
`;

const SectionHeader = styled.div`
  background: var(--color-bg-secondary);
  padding: 0.75rem var(--spacing-lg);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
`;

const SectionBody = styled.div`
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const Field    = styled.div`display: flex; flex-direction: column; gap: var(--spacing-xs);`;
const Label    = styled.label`font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-text-muted);`;
const Input    = styled.input`
  background: var(--color-bg-secondary);
  border: 1px solid ${({ $error }) => $error ? "var(--color-danger)" : "var(--color-border)"};
  border-radius: var(--radius-md);
  padding: 0.7rem 0.9rem;
  font-size: 0.9rem;
  color: var(--color-text);
  transition: var(--transition);
  width: 100%;
  &::placeholder { color: #9ca3af; }
  &:focus { outline: none; border-color: var(--color-primary); background: white; }
`;
const Select   = styled.select`
  background: var(--color-bg-secondary);
  border: 1px solid ${({ $error }) => $error ? "var(--color-danger)" : "var(--color-border)"};
  border-radius: var(--radius-md);
  padding: 0.7rem 0.9rem;
  font-size: 0.9rem;
  font-family: var(--font-family);
  color: var(--color-text);
  transition: var(--transition);
  cursor: pointer;
  width: 100%;
  &:focus { outline: none; border-color: var(--color-primary); background: white; }
`;
const ErrorMsg = styled.span`font-size: 0.72rem; color: var(--color-danger);`;

const ShippingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.9rem;
  background: ${({ $free }) => $free ? "#dcfce7" : "#f0f9ff"};
  border: 1px solid ${({ $free }) => $free ? "#86efac" : "#bae6fd"};
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  font-weight: 600;
  color: ${({ $free }) => $free ? "#166534" : "#0369a1"};
  flex-wrap: wrap;
`;

const PaymentOptions = styled.div`display: flex; flex-direction: column; gap: var(--spacing-sm);`;
const PaymentOpt = styled.label`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 2px solid ${({ $selected }) => $selected ? "var(--color-primary)" : "var(--color-border)"};
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition);
  background: ${({ $selected }) => $selected ? "var(--color-primary-light)" : "white"};
  font-weight: 600;
  font-size: 0.9rem;
  &:hover { border-color: var(--color-primary); }
  input { accent-color: #111827; }
`;

const Summary = styled.div`
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: sticky;
  top: calc(var(--navbar-height) + var(--spacing-md));
  @media (max-width: 1024px) { position: static; }
`;

const SummaryHeader = styled.div`
  background: #111827;
  color: white;
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const SummaryBody  = styled.div`padding: var(--spacing-lg); display: flex; flex-direction: column; gap: var(--spacing-sm);`;
const SummaryRow   = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ $bold }) => $bold ? "var(--color-text)" : "var(--color-text-muted)"};
  font-weight: ${({ $bold }) => $bold ? "800" : "400"};
  padding-top: ${({ $bold }) => $bold ? "var(--spacing-sm)" : "0"};
  border-top: ${({ $bold }) => $bold ? "1px solid var(--color-border)" : "none"};
  font-size: ${({ $bold }) => $bold ? "1.1rem" : "0.88rem"};
`;

const ItemLine = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  color: var(--color-text-muted);
  padding: 0.2rem 0;
  gap: 0.5rem;
  span:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }
  span:last-child { flex-shrink: 0; }
`;

const ConfirmBtn = styled.button`
  width: 100%;
  background: var(--color-accent);
  color: white;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.9rem;
  border-radius: var(--radius-md);
  transition: var(--transition);
  margin-top: var(--spacing-sm);
  &:hover:not(:disabled) { background: var(--color-accent-dark); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const SHIPPING_ZONES = [
  { value: "peninsula",  label: "España peninsular",  cost: 4.99,  freeFrom: 75 },
  { value: "baleares",   label: "Islas Baleares",     cost: 7.99,  freeFrom: null },
  { value: "canarias",   label: "Islas Canarias",     cost: 9.99,  freeFrom: null },
  { value: "ceuta",      label: "Ceuta y Melilla",    cost: 9.99,  freeFrom: null },
  { value: "portugal",   label: "Portugal",           cost: 6.99,  freeFrom: null },
  { value: "europa",     label: "Resto de Europa",    cost: 12.99, freeFrom: null },
];

const getShippingCost = (zone, subtotal) => {
  const z = SHIPPING_ZONES.find(z => z.value === zone);
  if (!z) return 4.99;
  if (z.freeFrom && subtotal >= z.freeFrom) return 0;
  return z.cost;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { paymentMethod: "card", zone: "peninsula" }
  });

  const paymentMethod = watch("paymentMethod");
  const zone          = watch("zone");
  const shipping      = getShippingCost(zone, totalPrice);
  const total         = totalPrice + shipping;
  const selectedZone  = SHIPPING_ZONES.find(z => z.value === zone);

  const onSubmit = async (data) => {
    try {
      const orderData = {
        items: items.map(i => ({
          product: i.product._id,
          quantity: i.quantity,
          price: i.product.price + ((i.customization?.name || i.customization?.number) ? 5 : 0),
        })),
        total,
        address: {
          street:     data.street,
          city:       data.city,
          postalCode: data.postalCode,
          country:    data.country || "España",
          zone:       data.zone,
        },
        paymentMethod: data.paymentMethod,
      };
      await createOrderService(orderData);
      clearCart();
      toast.success("¡Pedido confirmado! 🎉");
      navigate("/profile");
    } catch {
      toast.error("Error al procesar el pedido");
    }
  };

  return (
    <>
      <Header><Title>Finalizar pedido</Title></Header>
      <Layout>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Section>
            <SectionHeader>📍 Dirección de envío</SectionHeader>
            <SectionBody>
              <Field>
                <Label>Zona de envío</Label>
                <Select $error={errors.zone} {...register("zone", { required: true })}>
                  {SHIPPING_ZONES.map(z => (
                    <option key={z.value} value={z.value}>{z.label}</option>
                  ))}
                </Select>
                {selectedZone && (
                  <ShippingInfo $free={shipping === 0}>
                    {shipping === 0
                      ? `🎉 Envío gratuito (pedido superior a ${selectedZone.freeFrom}€)`
                      : `🚚 Envío: ${shipping.toFixed(2)}€${selectedZone.freeFrom ? ` · Gratis desde ${selectedZone.freeFrom}€` : ""}`
                    }
                  </ShippingInfo>
                )}
              </Field>
              <Field>
                <Label>Dirección</Label>
                <Input
                  placeholder="Calle Gran Vía, 28"
                  autoComplete="new-password"
                  $error={errors.street}
                  {...register("street", { required: "La dirección es obligatoria" })}
                />
                {errors.street && <ErrorMsg>{errors.street.message}</ErrorMsg>}
              </Field>
              <Row>
                <Field>
                  <Label>Ciudad</Label>
                  <Input
                    placeholder="Sevilla"
                    autoComplete="new-password"
                    $error={errors.city}
                    {...register("city", { required: "La ciudad es obligatoria" })}
                  />
                  {errors.city && <ErrorMsg>{errors.city.message}</ErrorMsg>}
                </Field>
                <Field>
                  <Label>Código postal</Label>
                  <Input
                    placeholder="41001"
                    autoComplete="new-password"
                    $error={errors.postalCode}
                    {...register("postalCode", { required: "El CP es obligatorio" })}
                  />
                  {errors.postalCode && <ErrorMsg>{errors.postalCode.message}</ErrorMsg>}
                </Field>
              </Row>
            </SectionBody>
          </Section>

          <Section>
            <SectionHeader>💳 Método de pago</SectionHeader>
            <SectionBody>
              <PaymentOptions>
                {[
                  { value: "card",     label: "💳 Tarjeta de crédito / débito" },
                  { value: "paypal",   label: "🅿️ PayPal" },
                  { value: "transfer", label: "🏦 Transferencia bancaria" },
                ].map(opt => (
                  <PaymentOpt key={opt.value} $selected={paymentMethod === opt.value}>
                    <input type="radio" value={opt.value} {...register("paymentMethod")} />
                    {opt.label}
                  </PaymentOpt>
                ))}
              </PaymentOptions>
            </SectionBody>
          </Section>
        </Form>

        <SummaryWrapper>
          <Summary>
            <SummaryHeader>Tu pedido</SummaryHeader>
            <SummaryBody>
              {items.map(item => (
                <ItemLine key={item.product._id}>
                  <span>{item.product.brand} — {item.product.name} ×{item.quantity}</span>
                  <span>{(item.product.price * item.quantity).toFixed(2)} €</span>
                </ItemLine>
              ))}
              <SummaryRow>
                <span>Subtotal</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </SummaryRow>
              <SummaryRow>
                <span>Envío</span>
                <span>{shipping === 0 ? "Gratis 🎉" : `${shipping.toFixed(2)} €`}</span>
              </SummaryRow>
              <SummaryRow $bold>
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </SummaryRow>
              <ConfirmBtn onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                {isSubmitting ? "Procesando..." : "✅ Confirmar pedido"}
              </ConfirmBtn>
            </SummaryBody>
          </Summary>
        </SummaryWrapper>
      </Layout>
    </>
  );
};

export default Checkout;