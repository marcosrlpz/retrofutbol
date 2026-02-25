import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { getAllProductsService } from "../services/product.service";
import useFetch from "../hooks/useFetch";
import ProductCard from "../components/ui/ProductCard";
import Loader from "../components/ui/Loader";

// ─── HERO SLIDER ────────────────────────────────────────────────────
const slides = [
  {
    bg: "/camisretro.jpg",
    bgPos: "center center",
    tag: "Nueva coleccion 2026",
    title: "Las mejores camisetas\nretro del mundo",
    sub: "Mas de 200 camisetas autenticas de los mejores equipos y selecciones de la historia del futbol.",
    cta: "Ver coleccion",
    link: "/products",
  },
  {
    bg: "/finidi.jpg",
    bgPos: "center 10%",
    tag: "La Liga Espanola",
    title: "El futbol espanol\nen estado puro",
    sub: "Finidi, Rivaldo, Raul... revive las camisetas mas iconicas de La Liga de los 90 y 2000.",
    cta: "Ver La Liga",
    link: "/products?category=La Liga",
  },
  {
    bg: "/roni.jpg",
    bgPos: "center 15%",
    tag: "Champions League",
    title: "Ronaldinho,\nmagia pura",
    sub: "Las noches de Champions que nunca olvidaras. Consigue la camiseta de los mejores momentos.",
    cta: "Ver camisetas",
    link: "/team/Barcelona",
  },
  {
    bg: "/magico.jpg",
    bgPos: "center 15%",
    tag: "Leyendas del futbol",
    title: "Magico Gonzalez,\numa lenda",
    sub: "El genio del Cadiz que enamoro a toda Espana. Hazte con la camiseta amarilla mas mitica de La Liga.",
    cta: "Ver Cadiz",
    link: "/team/Cadiz",
  },
];

const fadeIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;

const SliderWrapper = styled.div`
  position: relative;
  max-width: 1400px;
  margin: 0 auto 0;
  height: 580px;
  overflow: hidden;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  @media (max-width: 768px) {
    height: 420px;
    border-radius: 0;
  }
`;

const Slide = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${({ $bg }) => $bg});
  background-size: cover;
  background-position: ${({ $bgPos }) => $bgPos || "center center"};
  opacity: ${({ $active }) => $active ? 1 : 0};
  transition: opacity 0.8s ease;
  display: flex;
  align-items: center;
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(0,0,0,0.75) 35%, rgba(0,0,0,0.15));
  }
`;

const SlideContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 600px;
  padding: 0 var(--spacing-xl) 0 calc(var(--spacing-xl) + 40px);
  animation: ${({ $active }) => $active ? fadeIn : "none"} 0.7s ease;
  @media (max-width: 768px) { padding: 0 var(--spacing-xl); }
`;

const SlideTag = styled.span`
  display: inline-block;
  background: var(--color-accent);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.3rem 0.8rem;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-md);
`;

const SlideTitle = styled.h1`
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 800;
  color: white;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: var(--spacing-md);
  white-space: pre-line;
`;

const SlideSub = styled.p`
  color: rgba(255,255,255,0.75);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: var(--spacing-xl);
  max-width: 460px;
`;

const SlideBtn = styled(Link)`
  display: inline-block;
  background: var(--color-accent);
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.85rem 2rem;
  border-radius: var(--radius-md);
  transition: var(--transition);
  letter-spacing: 0.02em;
  &:hover { background: var(--color-accent-dark); transform: translateY(-1px); }
`;

const Dots = styled.div`
  position: absolute;
  bottom: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 3;
`;

const Dot = styled.button`
  width: ${({ $active }) => $active ? "28px" : "8px"};
  height: 8px;
  border-radius: var(--radius-full);
  background: ${({ $active }) => $active ? "var(--color-accent)" : "rgba(255,255,255,0.4)"};
  transition: var(--transition);
`;

// ─── FEATURES ───────────────────────────────────────────────────────
const FeaturesRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid var(--color-border);
  margin-top: var(--spacing-2xl);
  @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); }
`;

const Feature = styled.div`
  padding: var(--spacing-xl) var(--spacing-lg);
  text-align: center;
  border-right: 1px solid var(--color-border);
  &:last-child { border-right: none; }
  @media (max-width: 768px) {
    border-bottom: 1px solid var(--color-border);
    &:nth-child(2) { border-right: none; }
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-sm);
  font-size: 1.3rem;
`;

const FeatureTitle = styled.p`
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: var(--spacing-xs);
`;

const FeatureText = styled.p`
  font-size: 0.8rem;
  color: var(--color-text-muted);
  line-height: 1.5;
`;

// ─── SECTIONS ───────────────────────────────────────────────────────
const InnerContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2.5rem;
  @media (max-width: 768px) { padding: 0 1rem; }
`;

const Section = styled.section`
  padding: var(--spacing-3xl) 0;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: var(--spacing-xl);
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: var(--spacing-sm);
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-xl);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const SeeAll = styled(Link)`
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  &:hover { text-decoration: underline; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); gap: var(--spacing-sm); }
`;

// ─── CLUBS GRID ─────────────────────────────────────────────────────
const ClubsSection = styled.section`
  padding: var(--spacing-3xl) 0;
  background: var(--color-bg-secondary);
  margin: 0 calc(-1 * var(--spacing-xl));
  padding-left: var(--spacing-xl);
  padding-right: var(--spacing-xl);
  @media (max-width: 768px) {
    margin: 0 calc(-1 * var(--spacing-md));
    padding-left: var(--spacing-md);
    padding-right: var(--spacing-md);
  }
`;

const ClubsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: var(--spacing-md);
  @media (max-width: 1024px) { grid-template-columns: repeat(5, 1fr); }
  @media (max-width: 640px) { grid-template-columns: repeat(4, 1fr); gap: var(--spacing-sm); }
`;

const ClubCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: var(--transition);
  &:hover { border-color: var(--color-accent); transform: translateY(-3px); box-shadow: var(--shadow-md); }
`;

const ClubShield = styled.div`
  width: 68px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: white;
  border-radius: 50%;
  border: 2px solid #e0d9cc;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  img {
    width: 85%;
    height: 85%;
    object-fit: contain;
  }
`;

const ClubName = styled.p`
  font-size: 0.68rem;
  font-weight: 700;
  text-align: center;
  color: var(--color-text);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  line-height: 1.2;
`;

// ─── REVIEWS ────────────────────────────────────────────────────────
const ReviewsSection = styled.section`
  padding: var(--spacing-3xl) 0;
`;

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const ReviewCard = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
`;

const Stars = styled.div`
  color: #f4a261;
  font-size: 1rem;
  margin-bottom: var(--spacing-sm);
`;

const ReviewText = styled.p`
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  font-style: italic;
  margin-bottom: var(--spacing-md);
`;

const ReviewAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #111827;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
`;

const AuthorInfo = styled.div``;
const AuthorName = styled.p`font-weight: 700; font-size: 0.85rem;`;
const AuthorMeta = styled.p`font-size: 0.75rem; color: var(--color-text-muted);`;

// ─── MAP SECTION ─────────────────────────────────────────────────────
const MapSection = styled.section`
  padding: var(--spacing-3xl) 0 var(--spacing-3xl);
`;

const MapGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: var(--spacing-2xl);
  align-items: start;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const MapInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const MapInfoCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
`;

const MapInfoIcon = styled.div`
  width: 44px;
  height: 44px;
  background: #111827;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const MapInfoText = styled.div``;
const MapInfoTitle = styled.p`font-weight: 700; font-size: 0.9rem; margin-bottom: 0.2rem;`;
const MapInfoDesc = styled.p`font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.5;`;

const MapEmbed = styled.div`
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 2px solid var(--color-border);
  box-shadow: var(--shadow-md);
  height: 380px;
  iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }
`;

// ─── DATA ────────────────────────────────────────────────────────────
const clubs = [
  { name: "Barcelona",    shield: "/barca.jpg",            brand: "Barcelona" },
  { name: "Madrid",       shield: "/madrid.jpg",           brand: "Madrid" },
  { name: "Betis",        shield: "/betis.jpg",            brand: "Betis" },
  { name: "Cadiz",        shield: "/cadiz.jpg",            brand: "Cadiz" },
  { name: "Dep. Coruña",  shield: "/depor.jpg",            brand: "Deportivo de la Coruña" },
  { name: "Numancia",     shield: "/numan.jpg",            brand: "Numancia" },
  { name: "Recreativo",   shield: "/recre.jpg",            brand: "Recreativo de Huelva" },
  { name: "Athletic",     shield: "/bilbao.jpg",           brand: "Athletic Club Bilbao" },
  { name: "Valencia",     shield: "/valencia.jpg",         brand: "Valencia" },
  { name: "Man. United",  shield: "/man%20united.jpg",     brand: "Manchester United" },
  { name: "Arsenal",      shield: "/arsenal.jpg",          brand: "Arsenal" },
  { name: "Liverpool",    shield: "/liverpool.jpg",        brand: "Liverpool" },
  { name: "Chelsea",      shield: "/chelsea.jpg",          brand: "Chelsea" },
  { name: "Man. City",    shield: "/city.jpg",             brand: "Manchester City" },
  { name: "AC Milan",     shield: "/milan.jpg",            brand: "AC Milan" },
  { name: "Inter Milan",  shield: "/intermilan.jpg",       brand: "Inter de Milan" },
  { name: "Bayern",       shield: "/bayern%20munich.jpg",  brand: "Bayern Munich" },
  { name: "B. Dortmund",  shield: "/bdortmund.jpg",        brand: "Borussia Dortmund" },
  { name: "España",       shield: "/espa%C3%B1a.jpg",      brand: "España" },
  { name: "Brasil",       shield: "/brasil.jpg",           brand: "Brasil" },
  { name: "Argentina",    shield: "/argentina.jpg",        brand: "Argentina" },
  { name: "Nigeria",      shield: "/nigeria.jpg",          brand: "Nigeria" },
  { name: "Paises Bajos", shield: "/paisesbajos.jpg",      brand: "Paises Bajos" },
  { name: "Alemania",     shield: "/alemania.jpg",         brand: "Alemania" },
];

const reviews = [
  { stars: 5, text: "Increíble calidad. La camiseta del Barcelona 98-99 es idéntica a la original. El tejido, los colores... perfecta. Ya he pedido tres más.", name: "Carlos M.", meta: "Compró en enero 2026", initial: "C" },
  { stars: 5, text: "Fan del Manchester United desde siempre. La camiseta del Treble es una joya. Llegó en 3 días y el packaging es de lujo. 100% recomendado.", name: "David R.", meta: "Compró en diciembre 2025", initial: "D" },
  { stars: 5, text: "La camiseta de Maradona del 86 es una obra de arte. La llevo enmarcada en el salón. Atención al cliente excelente cuando tuve una duda.", name: "Javier L.", meta: "Compró en febrero 2026", initial: "J" },
];

const Home = () => {
  const [slide, setSlide] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => setSlide(v => (v + 1) % slides.length), 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const { data, loading } = useFetch(() => getAllProductsService({}), []);

  const featured = useMemo(() => {
    if (!data?.products) return [];
    const targets = [
      { brand: "Betis", nth: 0 },
      { brand: "Barcelona", nth: 0 },
      { brand: "Madrid", nth: 1 },
      { brand: "Paises Bajos", nth: 1 },
      { brand: "Nigeria", nth: 1 },
      { brand: "Recreativo de Huelva", nth: 0 },
      { brand: "Numancia", nth: 1 },
      { brand: "Manchester United", nth: 0 },
    ];
    return targets.map(({ brand, nth }) => {
      const matches = data.products.filter(p => p.brand === brand);
      return matches[nth] || matches[0] || null;
    }).filter(Boolean);
  }, [data]);

  return (
    <>
      {/* SLIDER */}
      <SliderWrapper>
        {slides.map((s, i) => (
          <Slide key={i} $bg={s.bg} $bgPos={s.bgPos} $active={i === slide}>
            <SlideContent $active={i === slide}>
              <SlideTag>{s.tag}</SlideTag>
              <SlideTitle>{s.title}</SlideTitle>
              <SlideSub>{s.sub}</SlideSub>
              <SlideBtn to={s.link}>{s.cta} →</SlideBtn>
            </SlideContent>
          </Slide>
        ))}
        <Dots>
          {slides.map((_, i) => (
            <Dot key={i} $active={i === slide} onClick={() => setSlide(i)} />
          ))}
        </Dots>
      </SliderWrapper>

      <InnerContainer>
        {/* FEATURES */}
        <FeaturesRow>
          <Feature>
            <FeatureIcon>🚚</FeatureIcon>
            <FeatureTitle>Envío gratis +75€</FeatureTitle>
            <FeatureText>Entrega en 3-5 días hábiles a toda España</FeatureText>
          </Feature>
          <Feature>
            <FeatureIcon>✅</FeatureIcon>
            <FeatureTitle>100% Auténticas</FeatureTitle>
            <FeatureText>Réplicas de alta calidad certificadas</FeatureText>
          </Feature>
          <Feature>
            <FeatureIcon>🔄</FeatureIcon>
            <FeatureTitle>Devoluciones fáciles</FeatureTitle>
            <FeatureText>30 días para cambios y devoluciones</FeatureText>
          </Feature>
          <Feature>
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureTitle>Pago seguro</FeatureTitle>
            <FeatureText>Tarjeta, PayPal y transferencia bancaria</FeatureText>
          </Feature>
        </FeaturesRow>

        {/* PRODUCTOS DESTACADOS */}
        <Section>
          <SectionHeader>
            <SectionTitle>⚽ Productos destacados</SectionTitle>
            <SeeAll to="/products">Ver todos →</SeeAll>
          </SectionHeader>
          {loading ? <Loader /> : (
            <Grid>
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </Grid>
          )}
        </Section>

        {/* ESCUDOS EQUIPOS */}
        <ClubsSection>
          <SectionHeader style={{borderBottomColor: "var(--color-primary)"}}>
            <SectionTitle>Nuestros equipos</SectionTitle>
          </SectionHeader>
          <ClubsGrid>
            {clubs.map(club => (
              <ClubCard key={club.brand} to={`/team/${encodeURIComponent(club.brand)}`}>
                <ClubShield>
                  <img
                    src={club.shield}
                    alt={club.name}
                    onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}
                  />
                  <span style={{display:"none", alignItems:"center", justifyContent:"center", width:"100%", height:"100%", fontSize:"1.6rem"}}>⚽</span>
                </ClubShield>
                <ClubName>{club.name}</ClubName>
              </ClubCard>
            ))}
          </ClubsGrid>
        </ClubsSection>

        {/* RESEÑAS */}
        <ReviewsSection>
          <SectionHeader>
            <SectionTitle>⭐ Lo que dicen nuestros clientes</SectionTitle>
          </SectionHeader>
          <ReviewsGrid>
            {reviews.map((r, i) => (
              <ReviewCard key={i}>
                <Stars>{"★".repeat(r.stars)}</Stars>
                <ReviewText>"{r.text}"</ReviewText>
                <ReviewAuthor>
                  <Avatar>{r.initial}</Avatar>
                  <AuthorInfo>
                    <AuthorName>{r.name}</AuthorName>
                    <AuthorMeta>{r.meta}</AuthorMeta>
                  </AuthorInfo>
                </ReviewAuthor>
              </ReviewCard>
            ))}
          </ReviewsGrid>
        </ReviewsSection>

        {/* ENCUÉNTRANOS */}
        <MapSection>
          <SectionHeader>
            <SectionTitle>📍 Encuéntranos</SectionTitle>
          </SectionHeader>
          <MapGrid>
            <MapInfo>
              <MapInfoCard>
                <MapInfoIcon>📍</MapInfoIcon>
                <MapInfoText>
                  <MapInfoTitle>Dirección</MapInfoTitle>
                  <MapInfoDesc>Calle Real, 15<br />11510 Puerto Real, Cádiz</MapInfoDesc>
                </MapInfoText>
              </MapInfoCard>
              <MapInfoCard>
                <MapInfoIcon>🕐</MapInfoIcon>
                <MapInfoText>
                  <MapInfoTitle>Horario de atención</MapInfoTitle>
                  <MapInfoDesc>
                    Lunes – Viernes: 9:00 – 21:00<br />
                    Sábado – Domingo: 9:00 – 15:00
                  </MapInfoDesc>
                </MapInfoText>
              </MapInfoCard>
              <MapInfoCard>
                <MapInfoIcon>📞</MapInfoIcon>
                <MapInfoText>
                  <MapInfoTitle>Contacto</MapInfoTitle>
                  <MapInfoDesc>
                    +34 900 123 456 (gratuito)<br />
                    info@retrofutbol.es
                  </MapInfoDesc>
                </MapInfoText>
              </MapInfoCard>
            </MapInfo>
            <MapEmbed>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12799.5!2d-6.1916!3d36.5274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0dd4f5a9a3e8c5%3A0x7e8e1b2c3d4f5a6b!2sPuerto%20Real%2C%20C%C3%A1diz%2C%20Spain!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="RetroFutbol en Puerto Real"
              />
            </MapEmbed>
          </MapGrid>
        </MapSection>

      </InnerContainer>
    </>
  );
};

export default Home;