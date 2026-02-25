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
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: var(--spacing-2xl);
  align-items: start;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
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

const Field = styled.div`display: flex; flex-direction: column; gap: var(--spacing-xs);`;
const Label = styled.label`font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-text-muted);`;
const Input = styled.input`
  background: var(--color-bg-secondary);
  border: 1px solid ${({ $error }) => $error ? "var(--color-danger)" : "var(--color-border)"};
  border-radius: var(--radius-md);
  padding: 0.7rem 0.9rem;
  font-size: 0.9rem;
  color: var(--color-text);
  transition: var(--transition);
  &:focus { outline: none; border-color: var(--color-primary); background: white; }
`;
const ErrorMsg = styled.span`font-size: 0.72rem; color: var(--color-danger);`;

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

const SummaryBody = styled.div`padding: var(--spacing-lg); display: flex; flex-direction: column; gap: var(--spacing-sm);`;
const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
  color: ${({ $bold }) => $bold ? "var(--color-text)" : "var(--color-text-muted)"};
  font-weight: ${({ $bold }) => $bold ? "800" : "400"};
  padding-top: ${({ $bold }) => "var(--spacing-sm)"};
  border-top: ${({ $bold }) => $bold ? "1px solid var(--color-border)" : "none"};
  font-size: ${({ $bold }) => $bold ? "1.1rem" : "0.88rem"};
`;

const ItemLine = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  color: var(--color-text-muted);
  padding: 0.2rem 0;
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

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const shipping = totalPrice >= 75 ? 0 : 4.99;
  const total = totalPrice + shipping;

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { paymentMethod: "card" }
  });
  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (data) => {
    try {
      const orderData = {
        items: items.map(i => ({ product: i.product._id, quantity: i.quantity, price: i.product.price })),
        total,
        address: { street: data.street, city: data.city, zip: data.zip, country: data.country || "España" },
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
                <Label>Dirección</Label>
                <Input placeholder="Calle Gran Vía, 28" $error={errors.street}
                  {...register("street", { required: "La dirección es obligatoria" })} />
                {errors.street && <ErrorMsg>{errors.street.message}</ErrorMsg>}
              </Field>
              <Row>
                <Field>
                  <Label>Ciudad</Label>
                  <Input placeholder="Sevilla" $error={errors.city}
                    {...register("city", { required: "La ciudad es obligatoria" })} />
                  {errors.city && <ErrorMsg>{errors.city.message}</ErrorMsg>}
                </Field>
                <Field>
                  <Label>Código postal</Label>
                  <Input placeholder="41001" $error={errors.zip}
                    {...register("zip", { required: "El CP es obligatorio" })} />
                  {errors.zip && <ErrorMsg>{errors.zip.message}</ErrorMsg>}
                </Field>
              </Row>
            </SectionBody>
          </Section>

          <Section>
            <SectionHeader>💳 Método de pago</SectionHeader>
            <SectionBody>
              <PaymentOptions>
                {[
                  { value: "card", label: "💳 Tarjeta de crédito / débito" },
                  { value: "paypal", label: "🅿️ PayPal" },
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

        <Summary>
          <SummaryHeader>Tu pedido</SummaryHeader>
          <SummaryBody>
            {items.map(item => (
              <ItemLine key={item.product._id}>
                <span>{item.product.brand} — {item.product.name} ×{item.quantity}</span>
                <span>{(item.product.price * item.quantity).toFixed(2)} €</span>
              </ItemLine>
            ))}
            <SummaryRow $bold={false}><span>Envío</span><span>{shipping === 0 ? "Gratis 🎉" : `${shipping.toFixed(2)} €`}</span></SummaryRow>
            <SummaryRow $bold><span>Total</span><span>{total.toFixed(2)} €</span></SummaryRow>
            <ConfirmBtn onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? "Procesando..." : "✅ Confirmar pedido"}
            </ConfirmBtn>
          </SummaryBody>
        </Summary>
      </Layout>
    </>
  );
};

export default Checkout;