import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import toast from "react-hot-toast";
import api from "../services/auth.service";

const Wrapper = styled.div`
  min-height: 70vh; display: flex; align-items: center; justify-content: center;
  padding: var(--spacing-2xl) var(--spacing-md);
`;
const Card = styled.div`
  width: 100%; max-width: 440px;
  background: white; border: 1px solid var(--color-border);
  border-radius: var(--radius-lg); overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
`;
const CardTop = styled.div`
  background: #1a2e1a; padding: var(--spacing-xl);
  text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
`;
const LogoImg = styled.img`
  width: 60px; height: 60px; object-fit: contain;
  border-radius: 50%; border: 2px solid var(--color-accent);
  background: white; padding: 4px;
`;
const Subtitle = styled.p`color: rgba(255,255,255,0.6); font-size: 0.82rem; margin: 0;`;
const CardBody = styled.div`padding: var(--spacing-xl);`;
const Title = styled.h2`font-size: 1.1rem; font-weight: 700; color: var(--color-text); margin: 0 0 0.5rem;`;
const Description = styled.p`font-size: 0.85rem; color: var(--color-text-muted); margin: 0 0 var(--spacing-lg);`;
const Field = styled.div`display: flex; flex-direction: column; gap: var(--spacing-xs);`;
const Label = styled.label`font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-text-muted);`;
const Input = styled.input`
  width: 100%; box-sizing: border-box;
  background: var(--color-bg-secondary); border: 1px solid var(--color-border);
  border-radius: var(--radius-md); padding: 0.7rem 0.9rem;
  font-size: 0.9rem; color: var(--color-text); transition: var(--transition);
  &::placeholder { color: #9ca3af; }
  &:focus { outline: none; border-color: var(--color-primary); background: white; }
`;
const SubmitBtn = styled.button`
  background: #111827; color: white; font-size: 0.9rem; font-weight: 700;
  padding: 0.85rem; border-radius: var(--radius-md); transition: var(--transition);
  margin-top: var(--spacing-md); width: 100%;
  &:hover:not(:disabled) { background: var(--color-accent); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
const SuccessBox = styled.div`
  background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-md);
  padding: var(--spacing-md); text-align: center;
`;
const SuccessIcon = styled.div`font-size: 2.5rem; margin-bottom: 0.5rem;`;
const SuccessText = styled.p`font-size: 0.85rem; color: #166534; margin: 0;`;
const Footer = styled.div`
  text-align: center; font-size: 0.82rem; color: var(--color-text-muted);
  margin-top: var(--spacing-md);
  a { color: var(--color-accent); font-weight: 700; }
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error("Introduce tu email"); return; }
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al enviar el email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Card>
        <CardTop>
          <LogoImg src="/logorf.png" alt="RetroFútbol" />
          <Subtitle>Recupera tu contraseña</Subtitle>
        </CardTop>
        <CardBody>
          {sent ? (
            <SuccessBox>
              <SuccessIcon>📬</SuccessIcon>
              <SuccessText>
                Te hemos enviado un email a <strong>{email}</strong> con las instrucciones para restablecer tu contraseña. Revisa también la carpeta de spam.
              </SuccessText>
            </SuccessBox>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
              <div>
                <Title>¿Olvidaste tu contraseña?</Title>
                <Description>Introduce tu email y te enviaremos un enlace para restablecerla.</Description>
              </div>
              <Field>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                />
              </Field>
              <SubmitBtn type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar enlace de recuperación"}
              </SubmitBtn>
            </form>
          )}
          <Footer><Link to="/login">← Volver al inicio de sesión</Link></Footer>
        </CardBody>
      </Card>
    </Wrapper>
  );
};

export default ForgotPassword;