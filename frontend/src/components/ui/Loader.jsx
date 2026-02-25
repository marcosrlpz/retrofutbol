import styled, { keyframes } from "styled-components";

const spin = keyframes`to { transform: rotate(360deg); }`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-3xl);
  gap: var(--spacing-md);
  width: 100%;
`;

const Spinner = styled.div`
  width: ${({ $size }) => $size || "36px"};
  height: ${({ $size }) => $size || "36px"};
  border: 3px solid var(--color-border);
  border-top-color: #111827;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

const Text = styled.p`
  font-size: 0.82rem;
  color: var(--color-text-muted);
  font-weight: 600;
`;

const Loader = ({ size, text = "Cargando..." }) => (
  <Wrapper>
    <Spinner $size={size} />
    <Text>{text}</Text>
  </Wrapper>
);

export default Loader;