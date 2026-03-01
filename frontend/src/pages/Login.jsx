import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import styled from "styled-components";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

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
const Form = styled.form`display: flex; flex-direction: column; gap: var(--spacing-md);`;
const Field = styled.div`display: flex; flex-direction: column; gap: var(--spacing-xs);`;
const FieldHeader = styled.div`display: flex; justify-content: space-between; align-items: center;`;
const Label = styled.label`font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-text-muted);`;
const ForgotLink = styled(Link)`
  font-size: 0.72rem; color: var(--color-accent); font-weight: 600;
  &:hover { text-decoration: underline; }
`;
const Input = styled.input`
  width: 100%; box-sizing: border-box;
  background: var(--color-bg-secondary); border: 1px solid var(--color-border);
  border-radius: var(--radius-md); padding: 0.7rem 0.9rem;
  font-size: 0.9rem; color: var(--color-text); transition: var(--transition);
  &::placeholder { color: #9ca3af; }
  &:focus { outline: none; border-color: var(--color-primary); background: white; }
`;
const ErrorMsg = styled.span`font-size: 0.72rem; color: var(--color-danger);`;
const CaptchaWrapper = styled.div`display: flex; justify-content: center; margin-top: var(--spacing-sm);`;
const SubmitBtn = styled.button`
  background: #111827; color: white; font-size: 0.9rem; font-weight: 700;
  padding: 0.85rem; border-radius: var(--radius-md); transition: var(--transition);
  margin-top: var(--spacing-sm); width: 100%;
  &:hover:not(:disabled) { background: var(--color-accent); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
const Footer = styled.div`
  text-align: center; font-size: 0.82rem; color: var(--color-text-muted);
  margin-top: var(--spacing-md);
  a { color: var(--color-accent); font-weight: 700; }
`;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    if (!captchaToken) { toast.error("Por favor completa el captcha"); return; }
    const result = await login(data.email, data.password, captchaToken);
    if (result.success) {
      toast.success("¡Bienvenido! 👋");
      navigate("/");
    } else {
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
      toast.error(result.error);
    }
  };

  return (
    <Wrapper>
      <Card>
        <CardTop>
          <LogoImg src="/logorf.png" alt="RetroFútbol" />
          <Subtitle>Inicia sesión en tu cuenta</Subtitle>
        </CardTop>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Field>
              <Label>Email</Label>
              <Input type="email" placeholder="Tu email" autoComplete="new-password"
                {...register("email", { required: "El email es obligatorio" })} />
              {errors.email && <ErrorMsg>{errors.email.message}</ErrorMsg>}
            </Field>
            <Field>
              <FieldHeader>
                <Label>Contraseña</Label>
                <ForgotLink to="/forgot-password">¿Olvidaste tu contraseña?</ForgotLink>
              </FieldHeader>
              <Input type="password" placeholder="Tu contraseña" autoComplete="new-password"
                {...register("password", { required: "La contraseña es obligatoria" })} />
              {errors.password && <ErrorMsg>{errors.password.message}</ErrorMsg>}
            </Field>
            <CaptchaWrapper>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6Le6q3gsAAAAAAoU6W5MTdzZogUCa1F4hcTx1q3k"
                onChange={(token) => setCaptchaToken(token)}
                onExpired={() => setCaptchaToken(null)}
              />
            </CaptchaWrapper>
            <SubmitBtn type="submit" disabled={isSubmitting || !captchaToken}>
              {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
            </SubmitBtn>
          </Form>
          <Footer>¿No tienes cuenta? <Link to="/register">Regístrate</Link></Footer>
        </CardBody>
      </Card>
    </Wrapper>
  );
};

export default Login;