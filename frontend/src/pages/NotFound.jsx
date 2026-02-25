import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(-5deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const Wrapper = styled.div`
  min-height: calc(100vh - var(--navbar-height) - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-xl);
`;

const Inner = styled.div`
  max-width: 520px;
`;

const Ball = styled.div`
  font-size: 5rem;
  animation: ${float} 3s ease-in-out infinite;
  margin-bottom: var(--spacing-lg);
  display: block;
`;

const Code = styled.h1`
  font-size: clamp(6rem, 15vw, 10rem);
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1;
  color: #111827;
  margin-bottom: var(--spacing-md);
  /* Degradado en el texto */
  background: linear-gradient(135deg, #111827 0%, #2d4a2d 50%, #c9a84c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Title = styled.h2`
  font-size: var(--font-size-xl);
  font-weight: 800;
  margin-bottom: var(--spacing-sm);
`;

const Subtitle = styled.p`
  color: var(--color-text-muted);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: var(--spacing-2xl);
`;

const Actions = styled.div`
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryBtn = styled(Link)`
  background: #111827;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.85rem 2rem;
  border-radius: var(--radius-md);
  transition: var(--transition);
  &:hover { background: var(--color-accent); }
`;

const SecondaryBtn = styled(Link)`
  background: transparent;
  color: var(--color-text);
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.85rem 2rem;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--color-border-dark);
  transition: var(--transition);
  &:hover { border-color: #111827; }
`;

const NotFound = () => (
  <Wrapper>
    <Inner>
      <Ball>⚽</Ball>
      <Code>404</Code>
      <Title>¡Fuera del campo!</Title>
      <Subtitle>
        Parece que esta página se ha ido al vestuario.<br />
        La camiseta que buscas no existe o ha sido eliminada.
      </Subtitle>
      <Actions>
        <PrimaryBtn to="/">Volver al inicio</PrimaryBtn>
        <SecondaryBtn to="/products">Ver camisetas</SecondaryBtn>
      </Actions>
    </Inner>
  </Wrapper>
);

export default NotFound;