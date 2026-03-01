import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { registerService } from "../services/auth.service";

const Wrapper = styled.div`
  min-height: 70vh; display: flex; align-items: center; justify-content: center;
  padding: var(--spacing-2xl) var(--spacing-md);
`;
const Card = styled.div`
  width: 100%; max-width: 520px;
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
const Row = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;
const Field = styled.div`display: flex; flex-direction: column; gap: var(--spacing-xs); min-width: 0;`;
const Label = styled.label`font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-text-muted);`;
const Input = styled.input`
  width: 100%; box-sizing: border-box;
  background: var(--color-bg-secondary); border: 1px solid var(--color-border);
  border-radius: var(--radius-md); padding: 0.7rem 0.9rem;
  font-size: 0.9rem; color: var(--color-text); transition: var(--transition);
  &::placeholder { color: #9ca3af; }
  &:focus { outline: none; border-color: var(--color-primary); background: white; }
`;
const ErrorMsg = styled.span`font-size: 0.72rem; color: var(--color-danger);`;
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

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const res = await registerService(data);
      login(res.user, res.token);
      toast.success(`¡Bienvenido, ${res.user.name}! 🎉`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <Wrapper>
      <Card>
        <CardTop>
          <LogoImg src="/logorf.png" alt="RetroFútbol" />
          <Subtitle>Crea tu cuenta</Subtitle>
        </CardTop>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Field>
                <Label>Nombre</Label>
                <Input placeholder="Tu nombre" autoComplete="new-password"
                  {...register("name", { required: "Obligatorio" })} />
                {errors.name && <ErrorMsg>{errors.name.message}</ErrorMsg>}
              </Field>
              <Field>
                <Label>Apellidos</Label>
                <Input placeholder="Tus apellidos" autoComplete="new-password"
                  {...register("lastname", { required: "Obligatorio" })} />
                {errors.lastname && <ErrorMsg>{errors.lastname.message}</ErrorMsg>}
              </Field>
            </Row>
            <Field>
              <Label>Email</Label>
              <Input type="email" placeholder="Tu email" autoComplete="new-password"
                {...register("email", { required: "El email es obligatorio" })} />
              {errors.email && <ErrorMsg>{errors.email.message}</ErrorMsg>}
            </Field>
            <Field>
              <Label>Contraseña</Label>
              <Input type="password" placeholder="Mínimo 6 caracteres" autoComplete="new-password"
                {...register("password", { required: "La contraseña es obligatoria", minLength: { value: 6, message: "Mínimo 6 caracteres" } })} />
              {errors.password && <ErrorMsg>{errors.password.message}</ErrorMsg>}
            </Field>
            <Field>
              <Label>Confirmar contraseña</Label>
              <Input type="password" placeholder="Repite la contraseña" autoComplete="new-password"
                {...register("confirmPassword", {
                  required: "Confirma tu contraseña",
                  validate: v => v === password || "Las contraseñas no coinciden"
                })} />
              {errors.confirmPassword && <ErrorMsg>{errors.confirmPassword.message}</ErrorMsg>}
            </Field>
            <SubmitBtn type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Crear cuenta"}
            </SubmitBtn>
          </Form>
          <Footer>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></Footer>
        </CardBody>
      </Card>
    </Wrapper>
  );
};

export default Register;