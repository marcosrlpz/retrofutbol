import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { verifyEmailService } from "../services/auth.service";

const Wrapper = styled.div`
  min-height: 70vh; display: flex; align-items: center; justify-content: center;
  padding: var(--spacing-2xl) var(--spacing-md);
`;
const Card = styled.div`
  width: 100%; max-width: 420px; background: white;
  border: 1px solid var(--color-border); border-radius: var(--radius-lg);
  padding: var(--spacing-2xl); text-align: center;
`;
const Icon = styled.div`font-size: 3.5rem; margin-bottom: var(--spacing-lg);`;
const Title = styled.h1`font-size: 1.4rem; font-weight: 800; margin-bottom: var(--spacing-sm);`;
const Text = styled.p`font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: var(--spacing-xl);`;
const Btn = styled(Link)`
  display: inline-block; background: #111827; color: white;
  font-size: 0.9rem; font-weight: 700; padding: 0.85rem 2rem;
  border-radius: var(--radius-md); transition: var(--transition);
  &:hover { background: var(--color-accent); }
`;

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmailService(token);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };
    verify();
  }, [token]);

  if (status === "loading") return (
    <Wrapper><Card><Icon>⏳</Icon><Title>Verificando tu cuenta...</Title></Card></Wrapper>
  );

  if (status === "success") return (
    <Wrapper>
      <Card>
        <Icon>✅</Icon>
        <Title>¡Cuenta verificada!</Title>
        <Text>Tu email ha sido confirmado correctamente. Ya puedes iniciar sesión y empezar a comprar.</Text>
        <Btn to="/login">Iniciar sesión →</Btn>
      </Card>
    </Wrapper>
  );

  return (
    <Wrapper>
      <Card>
        <Icon>❌</Icon>
        <Title>Enlace inválido</Title>
        <Text>El enlace de verificación no es válido o ha expirado. Regístrate de nuevo para recibir un nuevo enlace.</Text>
        <Btn to="/register">Volver al registro →</Btn>
      </Card>
    </Wrapper>
  );
};

export default VerifyEmail;