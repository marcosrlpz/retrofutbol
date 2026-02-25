import { useForm } from "react-hook-form";
import styled from "styled-components";
import toast from "react-hot-toast";

const PageWrapper = styled.div`
  padding: var(--spacing-3xl) var(--spacing-xl);
  max-width: 1100px;
  margin: 0 auto;
  @media (max-width: 768px) { padding: var(--spacing-2xl) var(--spacing-md); }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-3xl);
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: var(--spacing-md);
`;

const Title = styled.h1`
  font-size: var(--font-size-2xl);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Subtitle = styled.p`
  color: var(--color-text-muted);
  margin-top: var(--spacing-xs);
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: var(--spacing-3xl);
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const InfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
`;

const InfoCard = styled.div``;
const InfoIcon = styled.div`
  width: 44px;
  height: 44px;
  background: #111827;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-bottom: 0.6rem;
`;
const InfoTitle = styled.h3`font-size: 0.9rem; font-weight: 700; margin-bottom: 0.3rem;`;
const InfoText = styled.a`font-size: 0.85rem; color: var(--color-text-muted); display: block; transition: var(--transition); &:hover { color: var(--color-accent); }`;

const Schedule = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
`;
const ScheduleTitle = styled.h3`font-size: 0.85rem; font-weight: 700; margin-bottom: var(--spacing-md); text-transform: uppercase; letter-spacing: 0.05em;`;
const ScheduleRow = styled.div`display: flex; justify-content: space-between; font-size: 0.82rem; padding: 0.4rem 0; border-bottom: 1px solid var(--color-border); &:last-child { border-bottom: none; }`;
const Day = styled.span`color: var(--color-text-muted);`;
const Time = styled.span`font-weight: 700;`;

const FormCard = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
`;
const FormTitle = styled.h2`font-size: var(--font-size-lg); font-weight: 800; margin-bottom: var(--spacing-xl);`;
const Form = styled.form`display: flex; flex-direction: column; gap: var(--spacing-md);`;
const Row = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); @media (max-width: 480px) { grid-template-columns: 1fr; }`;
const Field = styled.div`display: flex; flex-direction: column; gap: var(--spacing-xs);`;
const Label = styled.label`font-size: 0.78rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em;`;
const Input = styled.input`
  background: white;
  border: 1px solid ${({ $error }) => $error ? "var(--color-danger)" : "var(--color-border)"};
  border-radius: var(--radius-md);
  padding: 0.7rem 1rem;
  color: var(--color-text);
  font-size: 0.9rem;
  transition: var(--transition);
  &:focus { outline: none; border-color: var(--color-primary); }
`;
const Textarea = styled.textarea`
  background: white;
  border: 1px solid ${({ $error }) => $error ? "var(--color-danger)" : "var(--color-border)"};
  border-radius: var(--radius-md);
  padding: 0.7rem 1rem;
  color: var(--color-text);
  font-size: 0.9rem;
  font-family: var(--font-family);
  resize: vertical;
  min-height: 120px;
  transition: var(--transition);
  &:focus { outline: none; border-color: var(--color-primary); }
`;

const SendBtn = styled.button`
  background: #111827;
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.9rem;
  border-radius: var(--radius-md);
  transition: var(--transition);
  &:hover:not(:disabled) { background: var(--color-accent); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 800));
    toast.success("¡Mensaje enviado! Te responderemos en menos de 24h.");
    reset();
  };

  return (
    <PageWrapper>
      <Header>
        <Title>Contacto</Title>
        <Subtitle>Estamos aquí para ayudarte con cualquier consulta sobre nuestras camisetas</Subtitle>
      </Header>
      <Layout>
        <InfoCol>
          <InfoCard>
            <InfoIcon>📧</InfoIcon>
            <InfoTitle>Email</InfoTitle>
            <InfoText href="mailto:info@retrofutbol.es">info@retrofutbol.es</InfoText>
            <InfoText href="mailto:pedidos@retrofutbol.es">pedidos@retrofutbol.es</InfoText>
          </InfoCard>
          <InfoCard>
            <InfoIcon>📞</InfoIcon>
            <InfoTitle>Teléfono</InfoTitle>
            <InfoText href="tel:+34900123456">+34 900 123 456</InfoText>
            <InfoText as="span">Llamada gratuita</InfoText>
          </InfoCard>
          <InfoCard>
            <InfoIcon>📍</InfoIcon>
            <InfoTitle>Dirección</InfoTitle>
            <InfoText as="span">Calle Real, 15</InfoText>
            <InfoText as="span">11510 Puerto Real, Cádiz</InfoText>
          </InfoCard>
          <Schedule>
            <ScheduleTitle>🕐 Horario de atención</ScheduleTitle>
            <ScheduleRow><Day>Lunes - Viernes</Day><Time>9:00 - 21:00</Time></ScheduleRow>
            <ScheduleRow><Day>Sábado - Domingo</Day><Time>9:00 - 15:00</Time></ScheduleRow>
          </Schedule>
        </InfoCol>
        <FormCard>
          <FormTitle>Envíanos un mensaje</FormTitle>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Field>
                <Label>Nombre</Label>
                <Input placeholder="Marcos" $error={errors.name} {...register("name", { required: true })} />
              </Field>
              <Field>
                <Label>Email</Label>
                <Input type="email" placeholder="tu@email.com" $error={errors.email} {...register("email", { required: true })} />
              </Field>
            </Row>
            <Field>
              <Label>Asunto</Label>
              <Input placeholder="¿En qué podemos ayudarte?" $error={errors.subject} {...register("subject", { required: true })} />
            </Field>
            <Field>
              <Label>Mensaje</Label>
              <Textarea placeholder="Escribe tu consulta aquí..." $error={errors.message} {...register("message", { required: true })} />
            </Field>
            <SendBtn type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar mensaje"}
            </SendBtn>
          </Form>
        </FormCard>
      </Layout>
    </PageWrapper>
  );
};

export default Contact;