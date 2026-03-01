import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`;

const Banner = styled.div`
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  max-width: 620px;
  background: #111827;
  color: white;
  border-radius: var(--radius-lg);
  padding: 1.5rem 1.75rem;
  box-shadow: 0 8px 40px rgba(0,0,0,0.35);
  z-index: 9999;
  animation: ${slideUp} 0.4s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 640px) {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    padding: 1.25rem;
  }
`;

const Title = styled.p`
  font-size: 0.95rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Text = styled.p`
  font-size: 0.82rem;
  color: rgba(255,255,255,0.72);
  line-height: 1.6;

  a {
    color: var(--color-accent, #c8a96e);
    text-decoration: underline;
    font-weight: 600;
    &:hover { opacity: 0.8; }
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const AcceptBtn = styled.button`
  background: var(--color-accent, #c8a96e);
  color: #111827;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 0.6rem 1.4rem;
  border-radius: var(--radius-md);
  transition: var(--transition);
  font-family: var(--font-family);
  &:hover { opacity: 0.85; }
`;

const RejectBtn = styled.button`
  background: transparent;
  color: rgba(255,255,255,0.6);
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.6rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255,255,255,0.2);
  transition: var(--transition);
  font-family: var(--font-family);
  &:hover { border-color: rgba(255,255,255,0.5); color: white; }
`;

const COOKIE_KEY = "retrofutbol_cookies";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    if (!saved) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(COOKIE_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Banner>
      <Title>🍪 Usamos cookies</Title>
      <Text>
        Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación y analizar el tráfico de la web.
        Puedes aceptarlas o rechazarlas. Más info en nuestra{" "}
        <Link to="/privacidad" onClick={reject}>política de privacidad</Link>.
      </Text>
      <Buttons>
        <AcceptBtn onClick={accept}>Aceptar todas</AcceptBtn>
        <RejectBtn onClick={reject}>Solo esenciales</RejectBtn>
      </Buttons>
    </Banner>
  );
};

export default CookieBanner;