import { useState } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`;

const faqs = [
  {
    category: "📦 Pedidos y envíos",
    items: [
      {
        q: "¿Cuánto tarda en llegar mi pedido?",
        a: "Los pedidos se procesan en 24-48h. El envío estándar tarda entre 3 y 5 días laborables en España peninsular. Para Canarias, Baleares, Ceuta y Melilla puede tardar entre 5 y 8 días.",
      },
      {
        q: "¿El envío es gratuito?",
        a: "Sí, el envío es completamente gratuito en pedidos superiores a 75€. Para pedidos inferiores, el coste de envío es de 4,95€.",
      },
      {
        q: "¿Puedo hacer seguimiento de mi pedido?",
        a: "Por supuesto. Una vez que tu pedido sea enviado, recibirás un email con el número de seguimiento para que puedas consultar el estado en tiempo real.",
      },
      {
        q: "¿Realizáis envíos internacionales?",
        a: "Actualmente enviamos a toda España. Estamos trabajando para ampliar nuestro servicio a Europa próximamente.",
      },
    ],
  },
  {
    category: "👕 Productos y tallas",
    items: [
      {
        q: "¿Las camisetas son réplicas o productos oficiales?",
        a: "Nuestras camisetas son réplicas de alta calidad inspiradas en los diseños originales de las temporadas históricas. No son productos con licencia oficial de los clubes.",
      },
      {
        q: "¿Cómo sé qué talla elegir?",
        a: "En cada producto tienes disponible nuestra guía de tallas con medidas exactas en centímetros. Te recomendamos medir tu pecho y compararlo con nuestra tabla antes de realizar el pedido.",
      },
      {
        q: "¿Puedo personalizar la camiseta con mi nombre y número?",
        a: "¡Sí! Ofrecemos personalización de dorsal (nombre y número) por un coste adicional de 5€. También puedes añadir parches especiales. Todo se gestiona desde la página de detalle del producto.",
      },
      {
        q: "¿Los colores de las fotos son fieles al producto real?",
        a: "Hacemos todo lo posible para que las fotos representen fielmente el producto. Sin embargo, puede haber ligeras variaciones dependiendo de la calibración de tu pantalla.",
      },
    ],
  },
  {
    category: "🔄 Devoluciones y cambios",
    items: [
      {
        q: "¿Puedo devolver una camiseta si no me queda bien?",
        a: "Tienes 30 días desde la recepción del pedido para solicitar una devolución. El producto debe estar en perfectas condiciones, sin usar y con las etiquetas originales.",
      },
      {
        q: "¿Las camisetas personalizadas tienen devolución?",
        a: "Las camisetas con personalización (nombre, número o parches) no admiten devolución salvo defecto de fabricación, ya que son productos personalizados.",
      },
      {
        q: "¿Cómo solicito un cambio de talla?",
        a: "Contacta con nosotros a través del formulario de contacto o por email indicando tu número de pedido y la talla deseada. Gestionaremos el cambio sin coste adicional.",
      },
    ],
  },
  {
    category: "💳 Pagos y seguridad",
    items: [
      {
        q: "¿Qué métodos de pago aceptáis?",
        a: "Aceptamos tarjeta de crédito/débito (Visa, Mastercard), transferencia bancaria y contra reembolso. Todos los pagos están protegidos con cifrado SSL.",
      },
      {
        q: "¿Es seguro comprar en RetroFútbol?",
        a: "Totalmente. Usamos tecnología de cifrado SSL para proteger todos tus datos. Nunca almacenamos los datos de tu tarjeta y seguimos todos los estándares de seguridad en pagos online.",
      },
      {
        q: "¿Cuándo se realiza el cargo?",
        a: "El cargo se realiza en el momento de confirmar el pedido. Si por cualquier motivo no podemos servirlo, realizamos el reembolso completo en un plazo máximo de 5 días laborables.",
      },
    ],
  },
  {
    category: "👤 Mi cuenta",
    items: [
      {
        q: "¿Es necesario registrarse para comprar?",
        a: "Puedes navegar y explorar el catálogo sin registrarte. Sin embargo, para completar una compra necesitarás crear una cuenta, lo que también te permitirá hacer seguimiento de tus pedidos.",
      },
      {
        q: "¿Cómo puedo cambiar mi contraseña?",
        a: "Desde tu perfil de usuario puedes actualizar tu información personal incluyendo la contraseña. Accede a 'Mi Perfil' una vez iniciada la sesión.",
      },
      {
        q: "¿Puedo ver el historial de mis pedidos?",
        a: "Sí, desde tu perfil tienes acceso completo al historial de todos tus pedidos con su estado actualizado en tiempo real.",
      },
    ],
  },
];

// ── Styled Components ────────────────────────────────────────────────────────

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
    background: radial-gradient(ellipse at center top, rgba(201,168,76,0.12) 0%, transparent 70%);
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
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: #f5f0e8;
  letter-spacing: -0.03em;
  margin-bottom: 1rem;
`;

const HeroSub = styled.p`
  color: rgba(245,240,232,0.55);
  font-size: 1rem;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Content = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 3rem 2rem 5rem;
  animation: ${fadeIn} 0.5s ease;
`;

const CategoryBlock = styled.div`
  margin-bottom: 2.5rem;
`;

const CategoryTitle = styled.h2`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
`;

const Item = styled.div`
  border: 1px solid ${({ $open }) => $open ? "#c9a84c" : "var(--color-border)"};
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: 0.6rem;
  transition: border-color 0.2s;
  background: white;

  &:hover {
    border-color: ${({ $open }) => $open ? "#c9a84c" : "#9ca3af"};
  }
`;

const Question = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.1rem 1.4rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  gap: 1rem;
`;

const QuestionText = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
`;

const Icon = styled.span`
  font-size: 1.2rem;
  color: #c9a84c;
  flex-shrink: 0;
  transition: transform 0.25s;
  transform: ${({ $open }) => $open ? "rotate(45deg)" : "rotate(0)"};
  font-weight: 300;
  line-height: 1;
`;

const Answer = styled.div`
  max-height: ${({ $open }) => $open ? "300px" : "0"};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const AnswerInner = styled.p`
  padding: 0 1.4rem 1.2rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.7;
  border-top: 1px solid var(--color-border);
  padding-top: 0.9rem;
  margin: 0 1.4rem;
  margin-bottom: 0.3rem;
`;

const ContactBanner = styled.div`
  margin-top: 3rem;
  background: #1a2e1a;
  border-radius: var(--radius-lg);
  padding: 2.5rem 2rem;
  text-align: center;
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

const BannerTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 800;
  color: #f5f0e8;
  margin-bottom: 0.5rem;
`;

const BannerSub = styled.p`
  color: rgba(245,240,232,0.55);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
`;

const BannerBtn = styled.a`
  display: inline-block;
  background: #c9a84c;
  color: #111827;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.8rem 2rem;
  border-radius: var(--radius-md);
  transition: var(--transition);
  position: relative;
  z-index: 1;
  &:hover { background: #b8963e; }
`;

// ── Componente Acordeón ──────────────────────────────────────────────────────

const AccordionItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <Item $open={open}>
      <Question onClick={() => setOpen(o => !o)}>
        <QuestionText>{q}</QuestionText>
        <Icon $open={open}>+</Icon>
      </Question>
      <Answer $open={open}>
        <AnswerInner>{a}</AnswerInner>
      </Answer>
    </Item>
  );
};

// ── Página principal ─────────────────────────────────────────────────────────

const FAQ = () => (
  <Page>
    <Hero>
      <HeroTag>Centro de ayuda</HeroTag>
      <HeroTitle>Preguntas Frecuentes</HeroTitle>
      <HeroSub>
        Todo lo que necesitas saber sobre pedidos, envíos, devoluciones y más.
      </HeroSub>
    </Hero>

    <Content>
      {faqs.map((cat) => (
        <CategoryBlock key={cat.category}>
          <CategoryTitle>{cat.category}</CategoryTitle>
          {cat.items.map((item) => (
            <AccordionItem key={item.q} q={item.q} a={item.a} />
          ))}
        </CategoryBlock>
      ))}

      <ContactBanner>
        <BannerTitle>¿No encuentras lo que buscas?</BannerTitle>
        <BannerSub>
          Nuestro equipo está disponible de lunes a viernes de 9h a 18h.
        </BannerSub>
        <BannerBtn href="/contact">Contactar con nosotros →</BannerBtn>
      </ContactBanner>
    </Content>
  </Page>
);

export default FAQ;