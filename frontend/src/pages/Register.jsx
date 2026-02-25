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
  padding: var(--spacing-2xl) var(--spacing-2xl);
  width: 100%;
  max-width: 580px;
  box-shadow: var(--shadow-md);
  box-sizing: border-box;
  overflow: hidden;
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

const Title = styled.h1`font-size: var(--font-size-xl); font-weight: 800; letter-spacing: -0.02em;`;
const Subtitle = styled.p`font-size: 0.85rem; color: var(--color-text-muted); margin-top: 0.3rem;`;

const Form = styled.form`display: flex; flex-direction: column; gap: var(--spacing-md);`;
const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  @media (max-width: 520px) { grid-template-columns: 1fr; }
`;
const Field = styled.div`display: flex; flex-direction: column; gap: var(--spacing-xs);`;
const Label = styled.label`font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-text-muted);`;
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
const ErrorMsg = styled.span`font-size: 0.72rem; color: var(--color-danger);`;

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

const LoginLink = styled.p`
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  a { font-weight: 700; color: var(--color-text); &:hover { color: var(--color-accent); } }
`;

const Register = () => {
  const { register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setError } = useForm();

  useEffect(() => { if (isAuthenticated) navigate("/"); }, [isAuthenticated]);

  const onSubmit = async (data) => {
    const result = await registerUser({
      name: data.name,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
    });
    if (!result.success) {
      setError("email", { message: result.error || "Error al registrarse" });
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
          <Title>Crear cuenta</Title>
          <Subtitle>Únete a RetroFútbol y consigue tus camisetas favoritas</Subtitle>
        </Top>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Field>
              <Label>Nombre</Label>
              <Input placeholder="Marcos" $error={errors.name}
                {...register("name", { required: "Obligatorio" })} />
              {errors.name && <ErrorMsg>{errors.name.message}</ErrorMsg>}
            </Field>
            <Field>
              <Label>Apellidos</Label>
              <Input placeholder="López" $error={errors.lastname}
                {...register("lastname", { required: "Obligatorio" })} />
              {errors.lastname && <ErrorMsg>{errors.lastname.message}</ErrorMsg>}
            </Field>
          </Row>
          <Field>
            <Label>Email</Label>
            <Input type="email" placeholder="tu@email.com" $error={errors.email}
              {...register("email", { required: "El email es obligatorio", pattern: { value: /^\S+@\S+\.\S+$/, message: "Email inválido" } })} />
            {errors.email && <ErrorMsg>{errors.email.message}</ErrorMsg>}
          </Field>
          <Field>
            <Label>Contraseña</Label>
            <Input type="password" placeholder="Mínimo 6 caracteres" $error={errors.password}
              {...register("password", { required: "Obligatorio", minLength: { value: 6, message: "Mínimo 6 caracteres" } })} />
            {errors.password && <ErrorMsg>{errors.password.message}</ErrorMsg>}
          </Field>
          <Field>
            <Label>Confirmar contraseña</Label>
            <Input type="password" placeholder="Repite la contraseña" $error={errors.confirm}
              {...register("confirm", { required: "Obligatorio", validate: v => v === watch("password") || "Las contraseñas no coinciden" })} />
            {errors.confirm && <ErrorMsg>{errors.confirm.message}</ErrorMsg>}
          </Field>
          <SubmitBtn type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </SubmitBtn>
          <LoginLink>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></LoginLink>
        </Form>
      </Card>
    </Wrapper>
  );
};

export default Register;