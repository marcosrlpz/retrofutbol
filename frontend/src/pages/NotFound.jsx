import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
`;

const Wrap = styled.div`
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-xl);
`;

const Ball = styled.div`
  font-size: 5rem;
  animation: ${float} 3s ease-in-out infinite;
  margin-bottom: var(--spacing-lg);
  filter: drop-shadow(0 8px 16px rgba(0,0,0,0.15));
`;

const Code = styled.p`
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-accent);
  margin-bottom: var(--spacing-sm);
`;

const Title = styled.h1`
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin-bottom: var(--spacing-md);
`;

const Sub = styled.p`
  font-size: 1rem;
  color: var(--color-text-muted);
  max-width: 400px;
  line-height: 1.6;
  margin-bottom: var(--spacing-2xl);
`;

const Btns = styled.div`
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  justify-content: center;
`;

const BtnPrimary = styled(Link)`
  background: #111827;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.85rem 1.75rem;
  border-radius: var(--radius-md);
  transition: var(--transition);
  &:hover { background: var(--color-accent); }
`;

const BtnSecondary = styled.button`
  background: white;
  color: var(--color-text);
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.85rem 1.75rem;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--color-border);
  transition: var(--transition);
  cursor: pointer;
  &:hover { border-color: #111827; }
`;

const Links = styled.div`
  display: flex;
  gap: var(--spacing-xl);
  margin-top: var(--spacing-2xl);
  flex-wrap: wrap;
  justify-content: center;
`;

const QuickLink = styled(Link)`
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text-muted);
  transition: var(--transition);
  &:hover { color: var(--color-accent); }
`;

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Wrap>
      <Ball>⚽</Ball>
      <Code>Error 404</Code>
      <Title>Esta página<br />se ha ido fuera</Title>
      <Sub>La camiseta que buscas no existe o ha sido eliminada. Pero tenemos más de 200 para elegir.</Sub>
      <Btns>
        <BtnPrimary to="/products">Ver todas las camisetas</BtnPrimary>
        <BtnSecondary onClick={() => navigate(-1)}>← Volver atrás</BtnSecondary>
      </Btns>
      <Links>
        <QuickLink to="/">Inicio</QuickLink>
        <QuickLink to="/products?category=La Liga">La Liga</QuickLink>
        <QuickLink to="/products?category=Selecciones">Selecciones</QuickLink>
        <QuickLink to="/contact">Contacto</QuickLink>
      </Links>
    </Wrap>
  );
};

export default NotFound;