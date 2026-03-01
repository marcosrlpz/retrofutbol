import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.footer`
  background: #111827;
  color: white;
  padding: var(--spacing-3xl) var(--spacing-xl) var(--spacing-xl);
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--spacing-2xl);
  @media (max-width: 1024px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const Brand = styled.div``;

const BrandLogo = styled(Link)`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
  img {
    height: 56px;
    width: auto;
    max-width: 200px;
    object-fit: contain;
    object-position: left center;
  }
`;

const BrandDesc = styled.p`
  color: rgba(255,255,255,0.5);
  font-size: 0.85rem;
  line-height: 1.7;
  max-width: 300px;
  margin-bottom: var(--spacing-lg);
`;

const ContactList = styled.div`display: flex; flex-direction: column; gap: 0.5rem;`;
const ContactItem = styled.a`
  color: rgba(255,255,255,0.55);
  font-size: 0.82rem;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover { color: var(--color-gold); }
`;

const Column = styled.div``;
const ColTitle = styled.h4`
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.35);
  margin-bottom: var(--spacing-md);
`;
const ColLink = styled(Link)`
  display: block;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
  margin-bottom: 0.5rem;
  transition: var(--transition);
  &:hover { color: white; }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255,255,255,0.08);
  max-width: 1400px;
  margin: var(--spacing-xl) auto var(--spacing-md);
`;

const Bottom = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
`;

const Copy = styled.p`font-size: 0.78rem; color: rgba(255,255,255,0.3);`;

const Footer = () => (
  <Wrapper>
    <Container>
      <Brand>
        <BrandLogo to="/">
          <img
            src="/logorf.png"
            alt="RetroFutbol"
            onError={e => { e.target.style.display = "none"; }}
          />
        </BrandLogo>
        <BrandDesc>
          La tienda de referencia en camisetas de futbol retro. Mas de 200 camisetas de los mejores equipos y selecciones de la historia.
        </BrandDesc>
        <ContactList>
          <ContactItem href="mailto:inf.retrofutbol@gmail.com">📧 inf.retrofutbol@gmail.com</ContactItem>
          <ContactItem href="tel:+34900123456">📞 +34 900 123 456</ContactItem>
          <ContactItem as="span">📍 Calle Real, 15 — Puerto Real, Cádiz</ContactItem>
        </ContactList>
      </Brand>

      <Column>
        <ColTitle>Ligas</ColTitle>
        {["La Liga", "Premier League", "Serie A", "Bundesliga", "Otros Paises", "Selecciones"].map(l => (
          <ColLink key={l} to={`/products?category=${encodeURIComponent(l)}`}>{l}</ColLink>
        ))}
      </Column>

      <Column>
        <ColTitle>Mi cuenta</ColTitle>
        <ColLink to="/login">Iniciar sesion</ColLink>
        <ColLink to="/register">Registrarse</ColLink>
        <ColLink to="/profile">Mi perfil</ColLink>
        <ColLink to="/cart">Mi carrito</ColLink>
      </Column>

      <Column>
        <ColTitle>Ayuda</ColTitle>
        <ColLink to="/contact">Contacto</ColLink>
        <ColLink to="/shipping">Envios y plazos</ColLink>
        <ColLink to="/shipping">Devoluciones</ColLink>
        <ColLink to="/faq">Preguntas frecuentes</ColLink>
        <ColLink to="/privacidad">Política de privacidad</ColLink>
      </Column>
    </Container>
    <Divider />
    <Bottom>
      <Copy>© 2026 RetroFutbol. Todos los derechos reservados.</Copy>
      <Copy>Hecho con ❤️ y pasion por el futbol · Marcos</Copy>
    </Bottom>
  </Wrapper>
);

export default Footer;