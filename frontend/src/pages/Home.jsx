import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { getAllProductsService } from "../services/product.service";
import api from "../services/auth.service";
import useFetch from "../hooks/useFetch";
import ProductCard from "../components/ui/ProductCard";
import { SkeletonGrid } from "../components/ui/SkeletonCard";

const slides = [
  { bg: "/camisretro.jpg", bgPos: "center center", tag: "Nueva coleccion 2026", title: "Las mejores camisetas\nretro del mundo", sub: "Mas de 200 camisetas autenticas de los mejores equipos y selecciones de la historia del futbol.", cta: "Ver coleccion", link: "/products" },
  { bg: "/finidi.jpg", bgPos: "center 10%", tag: "La Liga Espanola", title: "El futbol espanol\nen estado puro", sub: "Finidi, Rivaldo, Raul... revive las camisetas mas iconicas de La Liga de los 90 y 2000.", cta: "Ver La Liga", link: "/products?category=La Liga" },
  { bg: "/roni.jpg", bgPos: "center 15%", tag: "Champions League", title: "Ronaldinho,\nmagia pura", sub: "Las noches de Champions que nunca olvidaras. Consigue la camiseta de los mejores momentos.", cta: "Ver camisetas", link: "/team/Barcelona" },
  { bg: "/magico.jpg", bgPos: "center 15%", tag: "Leyendas del futbol", title: "Magico Gonzalez,\numa lenda", sub: "El genio del Cadiz que enamoro a toda Espana. Hazte con la camiseta amarilla mas mitica de La Liga.", cta: "Ver Cadiz", link: "/team/Cadiz" },
];

const fadeIn = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;

const SliderWrapper = styled.div`
  position: relative; width: 100%; max-width: 1400px; margin: 0 auto;
  height: 580px; overflow: hidden;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  @media (max-width: 768px) { height: 360px; border-radius: 0; }
`;
const Slide = styled.div`
  position: absolute; inset: 0;
  background-image: url(${({ $bg }) => $bg});
  background-size: cover; background-position: ${({ $bgPos }) => $bgPos || "center center"};
  opacity: ${({ $active }) => $active ? 1 : 0}; transition: opacity 0.8s ease;
  display: flex; align-items: center;
  &::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,0,0,0.75) 35%, rgba(0,0,0,0.15)); }
`;
const SlideContent = styled.div`
  position: relative; z-index: 2; max-width: 600px;
  padding: 0 var(--spacing-xl) 0 calc(var(--spacing-xl) + 40px);
  animation: ${({ $active }) => $active ? fadeIn : "none"} 0.7s ease;
  @media (max-width: 768px) { padding: 0 1.25rem; max-width: 100%; }
`;
const SlideTag = styled.span`
  display: inline-block; background: var(--color-accent); color: white;
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  padding: 0.3rem 0.8rem; border-radius: var(--radius-sm); margin-bottom: var(--spacing-md);
`;
const SlideTitle = styled.h1`
  font-size: clamp(1.4rem, 4vw, 3.2rem); font-weight: 800; color: white;
  line-height: 1.1; letter-spacing: -0.03em; margin-bottom: var(--spacing-md); white-space: pre-line;
`;
const SlideSub = styled.p`
  color: rgba(255,255,255,0.75); font-size: 0.9rem; line-height: 1.6;
  margin-bottom: var(--spacing-xl); max-width: 460px;
  @media (max-width: 768px) { display: none; }
`;
const SlideBtn = styled(Link)`
  display: inline-block; background: var(--color-accent); color: white;
  font-weight: 700; font-size: 0.85rem; padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md); transition: var(--transition);
  &:hover { background: var(--color-accent-dark); transform: translateY(-1px); }
`;
const Dots = styled.div`
  position: absolute; bottom: var(--spacing-lg); left: 50%; transform: translateX(-50%);
  display: flex; gap: 0.5rem; z-index: 3;
`;
const Dot = styled.button`
  width: ${({ $active }) => $active ? "28px" : "8px"}; height: 8px;
  border-radius: var(--radius-full);
  background: ${({ $active }) => $active ? "var(--color-accent)" : "rgba(255,255,255,0.4)"};
  transition: var(--transition);
`;

const FeaturesRow = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid var(--color-border); margin-top: var(--spacing-xl);
  @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); margin-top: var(--spacing-md); }
`;
const Feature = styled.div`
  padding: var(--spacing-lg); text-align: center;
  border-right: 1px solid var(--color-border); &:last-child { border-right: none; }
  @media (max-width: 768px) { padding: var(--spacing-md) var(--spacing-sm); border-bottom: 1px solid var(--color-border); &:nth-child(2) { border-right: none; } }
`;
const FeatureIcon  = styled.div`width: 44px; height: 44px; border-radius: 50%; background: #111827; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--spacing-sm); font-size: 1.2rem;`;
const FeatureTitle = styled.p`font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.25rem;`;
const FeatureText  = styled.p`font-size: 0.75rem; color: var(--color-text-muted); line-height: 1.5;`;

const InnerContainer = styled.div`
  max-width: 1400px; margin: 0 auto; padding: 0 2.5rem;
  @media (max-width: 768px) { padding: 0 1rem; }
`;
const Section = styled.section`
  padding: var(--spacing-3xl) 0;
  @media (max-width: 768px) { padding: var(--spacing-xl) 0; }
`;
const SectionHeader = styled.div`
  display: flex; justify-content: space-between; align-items: flex-end;
  margin-bottom: var(--spacing-xl); border-bottom: 2px solid var(--color-primary);
  padding-bottom: var(--spacing-sm);
  @media (max-width: 768px) { margin-bottom: var(--spacing-md); }
`;
const SectionTitle = styled.h2`
  font-size: clamp(0.85rem, 2.5vw, var(--font-size-xl)); font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.04em;
`;
const SeeAll = styled(Link)`
  font-size: 0.75rem; font-weight: 700; color: var(--color-accent);
  text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap;
  &:hover { text-decoration: underline; }
`;
const Grid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--spacing-md);
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); gap: var(--spacing-sm); }
`;

const NewBadge = styled.span`
  display: inline-block; background: #dc2626; color: white;
  font-size: 0.58rem; font-weight: 700; letter-spacing: 0.08em;
  padding: 0.15rem 0.4rem; border-radius: var(--radius-sm);
  text-transform: uppercase; margin-left: 0.5rem; vertical-align: middle;
`;

const ClubsSection = styled.section`
  background: var(--color-bg-secondary); padding: var(--spacing-3xl) 0;
  @media (max-width: 768px) { padding: var(--spacing-xl) 0; }
`;
const ClubsGrid = styled.div`
  display: grid; grid-template-columns: repeat(8, 1fr); gap: var(--spacing-md);
  @media (max-width: 1024px) { grid-template-columns: repeat(5, 1fr); }
  @media (max-width: 640px) { grid-template-columns: repeat(4, 1fr); gap: var(--spacing-sm); }
`;
const ClubCard = styled(Link)`
  display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
  padding: var(--spacing-sm); background: white;
  border: 1px solid var(--color-border); border-radius: var(--radius-lg); transition: var(--transition);
  &:hover { border-color: var(--color-accent); transform: translateY(-3px); box-shadow: var(--shadow-md); }
`;
const ClubShield = styled.div`
  width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
  overflow: hidden; background: white; border-radius: 50%;
  border: 2px solid #e0d9cc; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  @media (min-width: 640px) { width: 56px; height: 56px; }
  @media (min-width: 1024px) { width: 68px; height: 68px; }
  img { width: 85%; height: 85%; object-fit: contain; }
`;
const ClubName = styled.p`
  font-size: 0.58rem; font-weight: 700; text-align: center;
  color: var(--color-text); text-transform: uppercase; letter-spacing: 0.03em; line-height: 1.2;
  @media (min-width: 640px) { font-size: 0.65rem; }
  @media (min-width: 1024px) { font-size: 0.68rem; }
`;

const ReviewsSection = styled.section`
  padding: var(--spacing-3xl) 0;
  @media (max-width: 768px) { padding: var(--spacing-xl) 0; }
`;
const CarouselWrapper = styled.div`position: relative; overflow: hidden;`;
const CarouselTrack = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-lg);
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;
const ReviewCard = styled(motion.div)`
  background: var(--color-bg-secondary); border: 1px solid var(--color-border);
  border-radius: var(--radius-lg); padding: var(--spacing-xl);
  display: flex; flex-direction: column; gap: var(--spacing-sm);
`;
const Stars        = styled.div`color: #f4a261; font-size: 1rem;`;
const ReviewText   = styled.p`font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.6; font-style: italic; flex: 1;`;
const ReviewProduct = styled(Link)`font-size: 0.72rem; font-weight: 700; color: var(--color-accent); &:hover { text-decoration: underline; }`;
const ReviewAuthor = styled.div`display: flex; align-items: center; gap: var(--spacing-sm); margin-top: auto; padding-top: var(--spacing-sm); border-top: 1px solid var(--color-border);`;
const Avatar       = styled.div`width: 36px; height: 36px; border-radius: 50%; background: #111827; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; flex-shrink: 0;`;
const AuthorName   = styled.p`font-weight: 700; font-size: 0.85rem;`;
const AuthorMeta   = styled.p`font-size: 0.72rem; color: var(--color-text-muted);`;
const CarouselNav  = styled.div`display: flex; align-items: center; justify-content: center; gap: var(--spacing-md); margin-top: var(--spacing-xl);`;
const NavBtn       = styled.button`width: 40px; height: 40px; border-radius: 50%; border: 1.5px solid var(--color-border); display: flex; align-items: center; justify-content: center; font-size: 1rem; transition: var(--transition); &:hover:not(:disabled) { border-color: #111827; background: #111827; color: white; } &:disabled { opacity: 0.3; cursor: not-allowed; }`;
const NavDots      = styled.div`display: flex; gap: 0.4rem;`;
const NavDot       = styled.button`width: ${({ $active }) => $active ? "20px" : "8px"}; height: 8px; border-radius: 99px; background: ${({ $active }) => $active ? "#111827" : "var(--color-border)"}; transition: var(--transition);`;

const FallbackReviews = [
  { stars: 5, comment: "Increíble calidad. La camiseta del Barcelona 98-99 es idéntica a la original. El tejido, los colores... perfecta.", user: { name: "Carlos", lastname: "M." }, product: null, createdAt: "2026-01-15" },
  { stars: 5, comment: "Fan del Manchester United desde siempre. La camiseta del Treble es una joya. Llegó en 3 días y el packaging es de lujo.", user: { name: "David", lastname: "R." }, product: null, createdAt: "2025-12-20" },
  { stars: 5, comment: "La camiseta de Maradona del 86 es una obra de arte. La llevo enmarcada en el salón. Atención al cliente excelente.", user: { name: "Javier", lastname: "L." }, product: null, createdAt: "2026-02-01" },
  { stars: 5, comment: "Me llegó en perfectas condiciones y antes de lo esperado. La calidad es brutal, parece una camiseta oficial.", user: { name: "Marta", lastname: "S." }, product: null, createdAt: "2026-01-28" },
  { stars: 4, comment: "Muy buena calidad y envío rápido. La camiseta del Betis años 90 es exactamente lo que buscaba.", user: { name: "Antonio", lastname: "G." }, product: null, createdAt: "2026-02-10" },
  { stars: 5, comment: "Segunda compra y repito sin dudarlo. Las camisetas retro de selecciones son espectaculares.", user: { name: "Laura", lastname: "P." }, product: null, createdAt: "2026-02-15" },
];

const CARDS_PER_PAGE = 3;

const MapSection  = styled.section`padding: var(--spacing-3xl) 0; @media (max-width: 768px) { padding: var(--spacing-xl) 0; }`;
const MapGrid     = styled.div`display: grid; grid-template-columns: 1fr 1.6fr; gap: var(--spacing-2xl); align-items: start; @media (max-width: 768px) { grid-template-columns: 1fr; gap: var(--spacing-lg); }`;
const MapInfo     = styled.div`display: flex; flex-direction: column; gap: var(--spacing-lg);`;
const MapInfoCard = styled.div`display: flex; align-items: flex-start; gap: var(--spacing-md);`;
const MapInfoIcon = styled.div`width: 44px; height: 44px; background: #111827; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;`;
const MapInfoTitle = styled.p`font-weight: 700; font-size: 0.9rem; margin-bottom: 0.2rem;`;
const MapInfoDesc  = styled.p`font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.5;`;
const MapEmbed     = styled.div`border-radius: var(--radius-lg); overflow: hidden; border: 2px solid var(--color-border); box-shadow: var(--shadow-md); height: 280px; @media (min-width: 768px) { height: 380px; } iframe { width: 100%; height: 100%; border: none; display: block; }`;

const clubs = [
  { name: "Barcelona",    shield: "/barca.jpg",           brand: "Barcelona" },
  { name: "Madrid",       shield: "/madrid.jpg",          brand: "Madrid" },
  { name: "Betis",        shield: "/betis.jpg",           brand: "Betis" },
  { name: "Cadiz",        shield: "/cadiz.jpg",           brand: "Cadiz" },
  { name: "Dep. Coruña",  shield: "/depor.jpg",           brand: "Deportivo de la Coruña" },
  { name: "Numancia",     shield: "/numan.jpg",           brand: "Numancia" },
  { name: "Recreativo",   shield: "/recre.jpg",           brand: "Recreativo de Huelva" },
  { name: "Athletic",     shield: "/bilbao.jpg",          brand: "Athletic Club Bilbao" },
  { name: "Valencia",     shield: "/valencia.jpg",        brand: "Valencia" },
  { name: "Man. United",  shield: "/man%20united.jpg",    brand: "Manchester United" },
  { name: "Arsenal",      shield: "/arsenal.jpg",         brand: "Arsenal" },
  { name: "Liverpool",    shield: "/liverpool.jpg",       brand: "Liverpool" },
  { name: "Chelsea",      shield: "/chelsea.jpg",         brand: "Chelsea" },
  { name: "Man. City",    shield: "/city.jpg",            brand: "Manchester City" },
  { name: "AC Milan",     shield: "/milan.jpg",           brand: "AC Milan" },
  { name: "Inter Milan",  shield: "/intermilan.jpg",      brand: "Inter de Milan" },
  { name: "Bayern",       shield: "/bayern%20munich.jpg", brand: "Bayern Munich" },
  { name: "B. Dortmund",  shield: "/bdortmund.jpg",       brand: "Borussia Dortmund" },
  { name: "España",       shield: "/espa%C3%B1a.jpg",     brand: "España" },
  { name: "Brasil",       shield: "/brasil.jpg",          brand: "Brasil" },
  { name: "Argentina",    shield: "/argentina.jpg",       brand: "Argentina" },
  { name: "Nigeria",      shield: "/nigeria.jpg",         brand: "Nigeria" },
  { name: "Paises Bajos", shield: "/paisesbajos.jpg",     brand: "Paises Bajos" },
  { name: "Alemania",     shield: "/alemania.jpg",        brand: "Alemania" },
];

const ReviewsCarousel = () => {
  const [page, setPage] = useState(0);
  const autoRef = useRef();

  const fetchReviews = useCallback(() =>
    api.get("/reviews/latest").then(r => r.data).catch(() => ({ reviews: [] })), []);
  const { data } = useFetch(fetchReviews, []);

  const reviews = (data?.reviews?.length >= 3 ? data.reviews : FallbackReviews);
  const totalPages = Math.ceil(reviews.length / CARDS_PER_PAGE);
  const visible = reviews.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  useEffect(() => {
    autoRef.current = setInterval(() => {
      setPage(p => (p + 1) % totalPages);
    }, 5000);
    return () => clearInterval(autoRef.current);
  }, [totalPages]);

  const go = (dir) => {
    clearInterval(autoRef.current);
    setPage(p => (p + dir + totalPages) % totalPages);
  };

  return (
    <>
      <CarouselWrapper>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
          >
            <CarouselTrack>
              {visible.map((r, i) => (
                <ReviewCard key={i}>
                  <Stars>{"★".repeat(r.stars || r.rating)}{"☆".repeat(5 - (r.stars || r.rating))}</Stars>
                  <ReviewText>"{r.comment || r.text}"</ReviewText>
                  {r.product?.name && (
                    <ReviewProduct to={`/products/${r.product._id}`}>
                      📦 {r.product.name}
                    </ReviewProduct>
                  )}
                  <ReviewAuthor>
                    <Avatar>{(r.user?.name || "A")[0].toUpperCase()}</Avatar>
                    <div>
                      <AuthorName>{r.user?.name} {r.user?.lastname}</AuthorName>
                      <AuthorMeta>{new Date(r.createdAt).toLocaleDateString("es-ES", { year: "numeric", month: "long" })}</AuthorMeta>
                    </div>
                  </ReviewAuthor>
                </ReviewCard>
              ))}
            </CarouselTrack>
          </motion.div>
        </AnimatePresence>
      </CarouselWrapper>

      {totalPages > 1 && (
        <CarouselNav>
          <NavBtn onClick={() => go(-1)}>←</NavBtn>
          <NavDots>
            {Array.from({ length: totalPages }).map((_, i) => (
              <NavDot key={i} $active={i === page} onClick={() => { clearInterval(autoRef.current); setPage(i); }} />
            ))}
          </NavDots>
          <NavBtn onClick={() => go(1)}>→</NavBtn>
        </CarouselNav>
      )}
    </>
  );
};

const Home = () => {
  const [slide, setSlide] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => setSlide(v => (v + 1) % slides.length), 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const { data, loading } = useFetch(() => getAllProductsService({ limit: 100 }), []);

  const featured = useMemo(() => {
    if (!data?.products) return [];
    const targets = [
      { brand: "Betis", nth: 0 }, { brand: "Barcelona", nth: 0 },
      { brand: "Madrid", nth: 1 }, { brand: "Paises Bajos", nth: 1 },
      { brand: "Nigeria", nth: 1 }, { brand: "Recreativo de Huelva", nth: 0 },
      { brand: "Numancia", nth: 1 }, { brand: "Manchester United", nth: 0 },
    ];
    return targets.map(({ brand, nth }) => {
      const matches = data.products.filter(p => p.brand === brand);
      return matches[nth] || matches[0] || null;
    }).filter(Boolean);
  }, [data]);

  const novedades = useMemo(() => {
    if (!data?.products) return [];
    return [...data.products]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8);
  }, [data]);

  return (
    <>
      <Helmet>
        <title>RetroFútbol | Camisetas de Fútbol Retro Auténticas</title>
        <meta name="description" content="Más de 200 camisetas retro auténticas de los mejores equipos y selecciones de la historia del fútbol. Barcelona, Real Madrid, Argentina, Brasil y mucho más." />
        <meta name="keywords" content="camisetas retro futbol, camisetas vintage futbol, camisetas clasicas, retro football shirts" />
        <meta property="og:title" content="RetroFútbol | Camisetas de Fútbol Retro Auténticas" />
        <meta property="og:description" content="Más de 200 camisetas retro auténticas. Envío gratis en pedidos superiores a 75€." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://retrofutbol.vercel.app/" />
      </Helmet>

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
        <FeaturesRow>
          <Feature><FeatureIcon>🚚</FeatureIcon><FeatureTitle>Envío gratis +75€</FeatureTitle><FeatureText>Entrega en 7-15 días hábiles a toda España</FeatureText></Feature>
          <Feature><FeatureIcon>✅</FeatureIcon><FeatureTitle>100% Auténticas</FeatureTitle><FeatureText>Réplicas de alta calidad certificadas</FeatureText></Feature>
          <Feature><FeatureIcon>🔄</FeatureIcon><FeatureTitle>Devoluciones fáciles</FeatureTitle><FeatureText>30 días para cambios y devoluciones</FeatureText></Feature>
          <Feature><FeatureIcon>🔒</FeatureIcon><FeatureTitle>Pago seguro</FeatureTitle><FeatureText>Tarjeta, PayPal y transferencia bancaria</FeatureText></Feature>
        </FeaturesRow>

        <Section>
          <SectionHeader>
            <SectionTitle>🆕 Novedades <NewBadge>Nuevo</NewBadge></SectionTitle>
            <SeeAll to="/products">Ver todos →</SeeAll>
          </SectionHeader>
          {loading ? <SkeletonGrid count={8} columns={4} /> : (
            <Grid>{novedades.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}</Grid>
          )}
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>⚽ Productos destacados</SectionTitle>
            <SeeAll to="/products">Ver todos →</SeeAll>
          </SectionHeader>
          {loading ? <SkeletonGrid count={8} columns={4} /> : (
            <Grid>{featured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}</Grid>
          )}
        </Section>
      </InnerContainer>

      <ClubsSection>
        <InnerContainer>
          <SectionHeader style={{ borderBottomColor: "var(--color-primary)" }}>
            <SectionTitle>Nuestros equipos</SectionTitle>
          </SectionHeader>
          <ClubsGrid>
            {clubs.map(club => (
              <ClubCard key={club.brand} to={`/team/${encodeURIComponent(club.brand)}`}>
                <ClubShield>
                  <img src={club.shield} alt={club.name} onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                  <span style={{ display: "none", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: "1.2rem" }}>⚽</span>
                </ClubShield>
                <ClubName>{club.name}</ClubName>
              </ClubCard>
            ))}
          </ClubsGrid>
        </InnerContainer>
      </ClubsSection>

      <InnerContainer>
        <ReviewsSection>
          <SectionHeader>
            <SectionTitle>⭐ Lo que dicen nuestros clientes</SectionTitle>
          </SectionHeader>
          <ReviewsCarousel />
        </ReviewsSection>

        <MapSection>
          <SectionHeader>
            <SectionTitle>📍 Encuéntranos</SectionTitle>
          </SectionHeader>
          <MapGrid>
            <MapInfo>
              <MapInfoCard>
                <MapInfoIcon>📍</MapInfoIcon>
                <div><MapInfoTitle>Dirección</MapInfoTitle><MapInfoDesc>Calle Real, 15<br />11510 Puerto Real, Cádiz</MapInfoDesc></div>
              </MapInfoCard>
              <MapInfoCard>
                <MapInfoIcon>🕐</MapInfoIcon>
                <div><MapInfoTitle>Horario de atención</MapInfoTitle><MapInfoDesc>Lunes – Viernes: 9:00 – 21:00<br />Sábado: 10:00 – 15:00</MapInfoDesc></div>
              </MapInfoCard>
              <MapInfoCard>
                <MapInfoIcon>📞</MapInfoIcon>
                <div><MapInfoTitle>Contacto</MapInfoTitle><MapInfoDesc>+34 900 123 456 (gratuito)<br />inf.retrofutbol@gmail.com</MapInfoDesc></div>
              </MapInfoCard>
            </MapInfo>
            <MapEmbed>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12799.5!2d-6.1916!3d36.5274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0dd4f5a9a3e8c5%3A0x7e8e1b2c3d4f5a6b!2sPuerto%20Real%2C%20C%C3%A1diz%2C%20Spain!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses"
                allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
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