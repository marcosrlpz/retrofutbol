import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`;

const Page = styled.div`
  min-height: calc(100vh - var(--navbar-height));
  background: var(--color-bg);
`;

const Hero = styled.div`
  background: #1a2e1a;
  padding: 4rem 2rem 3rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center top, rgba(201,168,76,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const HeroTag = styled.p`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #c9a84c;
  margin-bottom: 0.75rem;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: #f5f0e8;
  letter-spacing: -0.03em;
  margin-bottom: 1rem;
`;

const HeroSub = styled.p`
  color: rgba(245,240,232,0.5);
  font-size: 0.9rem;
  max-width: 500px;
  margin: 0 auto;
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 3.5rem 2rem 5rem;
  animation: ${fadeIn} 0.5s ease;
`;

const Section = styled.section`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.05rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.75rem;
  padding-left: 0.9rem;
  border-left: 3px solid #c9a84c;
`;

const Text = styled.p`
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.8;
  margin-bottom: 0.75rem;
`;

const List = styled.ul`
  margin: 0.5rem 0 0.75rem 1.2rem;
  li {
    font-size: 0.9rem;
    color: var(--color-text-muted);
    line-height: 1.8;
    margin-bottom: 0.3rem;
  }
`;

const UpdatedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #f0ebe0;
  border: 1px solid #e0d8c8;
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  font-size: 0.78rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 2.5rem;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 2rem 0;
`;

const ContactBox = styled.div`
  background: #1a2e1a;
  border-radius: var(--radius-lg);
  padding: 2rem;
  text-align: center;
  margin-top: 3rem;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(201,168,76,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const ContactTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 800;
  color: #f5f0e8;
  margin-bottom: 0.4rem;
`;

const ContactText = styled.p`
  color: rgba(245,240,232,0.55);
  font-size: 0.88rem;
  margin-bottom: 1.2rem;
`;

const ContactLink = styled.a`
  color: #c9a84c;
  font-weight: 700;
  font-size: 0.9rem;
  position: relative;
  z-index: 1;
  &:hover { text-decoration: underline; }
`;

const Privacidad = () => (
  <Page>
    <Hero>
      <HeroTag>Legal</HeroTag>
      <HeroTitle>Política de Privacidad</HeroTitle>
      <HeroSub>Tu privacidad es importante para nosotros. Aquí te explicamos cómo tratamos tus datos.</HeroSub>
    </Hero>

    <Content>
      <UpdatedBadge>📅 Última actualización: enero de 2026</UpdatedBadge>

      <Section>
        <SectionTitle>1. Responsable del tratamiento</SectionTitle>
        <Text>
          El responsable del tratamiento de los datos personales recogidos en esta web es <strong>RetroFútbol</strong>, con domicilio en Calle Real, 15, 11510 Puerto Real, Cádiz, España. Puedes contactarnos en <strong>inf.retrofutbol@gmail.com</strong>.
        </Text>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>2. Datos que recopilamos</SectionTitle>
        <Text>Recopilamos los siguientes datos personales cuando interactúas con nuestra web:</Text>
        <List>
          <li><strong>Datos de registro:</strong> nombre, apellidos, dirección de email y contraseña (cifrada).</li>
          <li><strong>Datos de pedido:</strong> dirección de envío, número de teléfono e historial de compras.</li>
          <li><strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas y tiempo de visita, a través de cookies técnicas.</li>
          <li><strong>Datos de contacto:</strong> cualquier información que nos facilites a través del formulario de contacto.</li>
        </List>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>3. Finalidad del tratamiento</SectionTitle>
        <Text>Utilizamos tus datos para las siguientes finalidades:</Text>
        <List>
          <li>Gestionar tu cuenta de usuario y procesar tus pedidos.</li>
          <li>Enviarte confirmaciones de compra y actualizaciones sobre el estado de tus pedidos.</li>
          <li>Atender tus consultas y solicitudes a través del formulario de contacto.</li>
          <li>Mejorar nuestros servicios y la experiencia de usuario en la web.</li>
          <li>Cumplir con nuestras obligaciones legales y fiscales.</li>
        </List>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>4. Base legal del tratamiento</SectionTitle>
        <Text>
          El tratamiento de tus datos se basa en la ejecución del contrato de compraventa (procesamiento de pedidos), tu consentimiento expreso (formulario de contacto y comunicaciones comerciales) y el cumplimiento de obligaciones legales aplicables al comercio electrónico.
        </Text>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>5. Conservación de los datos</SectionTitle>
        <Text>
          Conservamos tus datos personales durante el tiempo necesario para cumplir con la finalidad para la que fueron recogidos. Los datos de pedidos se conservan durante un mínimo de 5 años por obligaciones fiscales. Puedes solicitar la eliminación de tu cuenta en cualquier momento.
        </Text>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>6. Tus derechos</SectionTitle>
        <Text>De acuerdo con el Reglamento General de Protección de Datos (RGPD), tienes los siguientes derechos:</Text>
        <List>
          <li><strong>Acceso:</strong> conocer qué datos tuyos tratamos.</li>
          <li><strong>Rectificación:</strong> corregir datos incorrectos o incompletos.</li>
          <li><strong>Supresión:</strong> solicitar la eliminación de tus datos ("derecho al olvido").</li>
          <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado.</li>
          <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos en determinadas circunstancias.</li>
          <li><strong>Limitación:</strong> solicitar la limitación del tratamiento de tus datos.</li>
        </List>
        <Text>
          Para ejercer cualquiera de estos derechos, puedes contactarnos en <strong>inf.retrofutbol@gmail.com</strong> indicando tu solicitud y adjuntando una copia de tu DNI o documento identificativo.
        </Text>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>7. Cookies</SectionTitle>
        <Text>
          Esta web utiliza únicamente cookies técnicas estrictamente necesarias para el funcionamiento del servicio (gestión de sesión y carrito de compra). No utilizamos cookies de seguimiento ni publicitarias de terceros.
        </Text>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>8. Seguridad</SectionTitle>
        <Text>
          Aplicamos medidas técnicas y organizativas para proteger tus datos: cifrado SSL en todas las comunicaciones, contraseñas almacenadas con hash bcrypt y acceso restringido a los datos mediante autenticación JWT. Nunca vendemos ni cedemos tus datos a terceros con fines comerciales.
        </Text>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>9. Cambios en esta política</SectionTitle>
        <Text>
          Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos cualquier cambio significativo por email o mediante un aviso visible en la web. La fecha de última actualización siempre estará indicada al inicio de este documento.
        </Text>
      </Section>

      <ContactBox>
        <ContactTitle>¿Tienes alguna pregunta sobre privacidad?</ContactTitle>
        <ContactText>Escríbenos y te responderemos en menos de 48 horas.</ContactText>
        <ContactLink href="mailto:inf.retrofutbol@gmail.com">inf.retrofutbol@gmail.com →</ContactLink>
      </ContactBox>
    </Content>
  </Page>
);

export default Privacidad;