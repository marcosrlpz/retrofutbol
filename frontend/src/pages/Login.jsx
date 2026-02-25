import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 var(--spacing-md);
  width: 100%;
  box-sizing: border-box;
`;

const Card = styled.div`
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  width: 100%;
  max-width: 420px;
  box-shadow: var(--shadow-md);
`;

const Top = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

const LogoImg = styled.img`
  height: 60px;
  width: auto;
  object-fit: contain;
  margin: 0 auto var(--spacing-md);
  display: block;
`;

const Title = styled.h1`
  font-size: var(--font-size-xl);
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-top: 0.3rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const Label = styled.label`
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
`;

const Input = styled.input`
  background: var(--color-bg-secondary);
  border: 1px solid ${({ $error }) => $error ? "var(--color-danger)" : "var(--color-border)"};
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  color: var(--color-text);
  transition: var(--transition);
  &:focus { outline: none; border-color: var(--color-primary); background: white; }
`;

const ErrorMsg = styled.span`
  font-size: 0.72rem;
  color: var(--color-danger);
`;

const SubmitBtn = styled.button`
  background: #111827;
  color: white;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.85rem;
  border-radius: var(--radius-md);
  transition: var(--transition);
  margin-top: var(--spacing-xs);
  &:hover:not(:disabled) { background: var(--color-accent); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-light);
  font-size: 0.78rem;
  &::before, &::after { content: ""; flex: 1; height: 1px; background: var(--color-border); }
`;

const RegisterLink = styled(Link)`
  display: block;
  text-align: center;
  padding: 0.85rem;
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-text);
  transition: var(--transition);
  &:hover { border-color: var(--color-primary); }
`;

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm();

  useEffect(() => { if (isAuthenticated) navigate("/"); }, [isAuthenticated]);

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (!result.success) {
      setError("password", { message: result.error || "Email o contraseña incorrectos" });
    }
  };

  return (
    <Wrapper>
      <Card>
        <Top>
          <LogoImg
            src="/logorf.png"
            alt="RetroFutbol"
            onError={e => { e.target.style.display = "none"; }}
          />
          <Title>Bienvenido de vuelta</Title>
          <Subtitle>Accede a tu cuenta de RetroFútbol</Subtitle>
        </Top>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Field>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="tu@email.com"
              $error={errors.email}
              {...register("email", { required: "El email es obligatorio" })}
            />
            {errors.email && <ErrorMsg>{errors.email.message}</ErrorMsg>}
          </Field>
          <Field>
            <Label>Contraseña</Label>
            <Input
              type="password"
              placeholder="••••••••"
              $error={errors.password}
              {...register("password", { required: "La contraseña es obligatoria" })}
            />
            {errors.password && <ErrorMsg>{errors.password.message}</ErrorMsg>}
          </Field>
          <SubmitBtn type="submit" disabled={isSubmitting || loading}>
            {isSubmitting ? "Entrando..." : "Iniciar sesión"}
          </SubmitBtn>
          <Divider>o</Divider>
          <RegisterLink to="/register">Crear cuenta nueva</RegisterLink>
        </Form>
      </Card>
    </Wrapper>
  );
};

export default Login;