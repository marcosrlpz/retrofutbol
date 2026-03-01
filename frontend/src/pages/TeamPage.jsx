import { useParams, Link } from "react-router-dom";
import { useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { getAllProductsService } from "../services/product.service";
import useFetch from "../hooks/useFetch";
import ProductCard from "../components/ui/ProductCard";
import { SkeletonGrid } from "../components/ui/SkeletonCard";

/** Convierte nombres a slug para evitar problemas con ñ/acentos/espacios */
const toSlug = (str = "") =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/ñ/g, "n")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

/** Arregla cómo se muestra el nombre si llega sin ñ desde la URL */
const displayNameFix = (name = "") => {
  const fixes = {
    "Deportivo de la Coruna": "Deportivo de la Coruña",
  };
  return fixes[name] || name;
};

/** HeroMap por SLUG (no por nombre con acentos) */
const heroMap = {
  "ac-milan":                { h1: "acmilan1",            h2: "acmilan2",            pos1: "center 05%",  pos2: "center 100%" },
  "ajax":                    { h1: "ajax1",               h2: "ajax2",               pos1: "center 20%",  pos2: "center center" },
  "alemania":                { h1: "alemania1",           h2: "alemania2",           pos1: "center center",  pos2: "center 10%" },
  "argentina":               { h1: "argentina1",          h2: "argentina2",          pos1: "center 30%",  pos2: "center 10%" },
  "arsenal":                 { h1: "arsenal1",            h2: "arsenal2",            pos1: "center center",  pos2: "center center" },
  "as-roma":                 { h1: "asroma1",             h2: "asroma2",             pos1: "center center",  pos2: "center center" },
  "barcelona":               { h1: "barcelona1",          h2: "barcelona2",      pos1: "center center",  pos2: "center center" },
  "bayern-munich":           { h1: "bayern1",             h2: "bayern2",             pos1: "center center",  pos2: "center center" },
  "benfica":                 { h1: "benfica1",            h2: "benfica2",            pos1: "center center",  pos2: "center center" },
  "betis":                   { h1: "betis1",              h2: "betis2",              pos1: "center center",  pos2: "center center" },
  "athletic-club-bilbao":    { h1: "bilbao1",             h2: "bilbao2",             pos1: "center center",  pos2: "center center" },
  "borussia-dortmund":       { h1: "borussia1",           h2: "borussia2",           pos1: "center center",  pos2: "center center" },
  "brasil":                  { h1: "brasil1",             h2: "brasil2",             pos1: "center center",  pos2: "center center" },
  "werder-bremen":           { h1: "bremer1",             h2: "bremer2",             pos1: "center center",  pos2: "center 01%" },
  "cadiz":                   { h1: "cadiz1",              h2: "cadiz2",              pos1: "center center",  pos2: "center center" },
  "chelsea":                 { h1: "chelsea1",            h2: "chelsea2",            pos1: "center center",  pos2: "center 15%" },
  "manchester-city":         { h1: "city1",               h2: "city2",               pos1: "center 80%",     pos2: "center center" },
  "deportivo-de-la-coruna":  { h1: "deportivocoruña1",    h2: "deportivocoruña2",    pos1: "center center",  pos2: "center center" },
  "fiorentina":              { h1: "fiorentina1",         h2: "fiorentina2",         pos1: "center center",  pos2: "center center" },
  "france":                  { h1: "francia1",            h2: "francia2",            pos1: "center center",  pos2: "center 15%" },
  "inter-de-milan":          { h1: "intermilan1",         h2: "intermilan2",         pos1: "center center",  pos2: "center center" },
  "bayer-leverkusen":        { h1: "leverkusen1",         h2: "leverkusen2",         pos1: "center center",  pos2: "center center" },
  "liverpool":               { h1: "liverpool1",          h2: "liverpool2",          pos1: "center 80%",  pos2: "center center" },
  "olympique-de-lyon":       { h1: "lyon1",               h2: "lyon2",               pos1: "center center",  pos2: "center center" },
  "madrid":                  { h1: "madrid1",             h2: "madrid2",             pos1: "center center",  pos2: "center center" },
  "olympique-de-marsella":   { h1: "marsella1",           h2: "marsella2",           pos1: "center center",  pos2: "center center" },
  "nigeria":                 { h1: "nigeria1",            h2: "nigeria2",            pos1: "center center",  pos2: "center center" },
  "numancia":                { h1: "numancia1",           h2: "numancia2",           pos1: "center center",  pos2: "center center" },
  "paises-bajos":            { h1: "paisesbajos1",        h2: "paisesbajos2",        pos1: "center center",  pos2: "center 70%" },
  "psg":                     { h1: "psg1",                h2: "psg2",                pos1: "center center",  pos2: "center center" },
  "recreativo-de-huelva":    { h1: "recre1",              h2: "recre2",              pos1: "center center",  pos2: "center center" },
  "santos":                  { h1: "santos1",             h2: "santos2",             pos1: "center center",  pos2: "center center" },
  "fc-schalke-04":           { h1: "schalke1",            h2: "schalke2",            pos1: "center center",  pos2: "center center" },
  "espana":                  { h1: "spain1",              h2: "spain2",              pos1: "center center",  pos2: "center center" },
  "manchester-united":       { h1: "united1",             h2: "united2",             pos1: "center center",  pos2: "center center" },
  "valencia":                { h1: "valencia1",           h2: "valencia2",           pos1: "center center",  pos2: "center center" },
};

const fadeIn = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;

const PageWrapper = styled.div`
  position: relative;
  min-height: calc(100vh - 82px);
  background: #1a2e1a;
  /* Romper el max-width y padding del Layout */
  width: 100vw;
  margin-left: calc(-50vw + 50%);
`;

const BgSplit = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  z-index: 0;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
`;

const BgHalf = styled.div`
  position: relative;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(15, 25, 15, 0.5);
  }
`;

const BgImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: ${({ $pos }) => $pos || "center center"};
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 2rem 4rem;
  @media (max-width: 768px) { padding: 1.5rem 1rem 3rem; }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: rgba(245,240,232,0.75);
  font-size: 0.82rem;
  font-weight: 700;
  transition: all 0.2s;
  &:hover { color: #c9a84c; }
`;

const TeamHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  animation: ${fadeIn} 0.6s ease;
`;

const TeamTag = styled.p`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #c9a84c;
  margin-bottom: 0.5rem;
`;

const TeamName = styled.h1`
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  color: #f5f0e8;
  letter-spacing: -0.03em;
  line-height: 1;
  text-shadow: 0 2px 20px rgba(0,0,0,0.5);
`;

const Count = styled.p`
  font-size: 0.85rem;
  color: rgba(245,240,232,0.6);
  margin-top: 0.5rem;
  font-weight: 500;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  &[data-count="3"],
  &[data-count="4"] {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 1rem;
  }
`;

const CardWrapper = styled.div`
  background: rgba(245,240,232,0.96);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.35);
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.45);
  }
`;

const Empty = styled.div`
  text-align: center;
  padding: 5rem;
  color: rgba(245,240,232,0.6);
`;

const TeamPage = () => {
  const { brand } = useParams();

  const decodedBrandRaw = decodeURIComponent(brand);
  const decodedBrand = displayNameFix(decodedBrandRaw);
  const slug = toSlug(decodedBrandRaw);

  const heroes = heroMap[slug];
  const hero1 = heroes ? `/${heroes.h1}.jpg` : "/camisretro.jpg";
  const hero2 = heroes ? `/${heroes.h2}.jpg` : "/camisretro.jpg";
  const pos1  = heroes?.pos1 || "center center";
  const pos2  = heroes?.pos2 || "center center";

  const { data, loading } = useFetch(
    useCallback(() => getAllProductsService({ brand: decodedBrand }), [decodedBrand]),
    [decodedBrand]
  );

  const products = data?.products || [];

  return (
    <PageWrapper>
      <BgSplit>
        <BgHalf>
          <BgImg
            src={hero1}
            alt=""
            $pos={pos1}
            onError={(e) => {
              e.target.src = "/camisretro.jpg";
              e.target.onerror = null;
            }}
          />
        </BgHalf>
        <BgHalf>
          <BgImg
            src={hero2}
            alt=""
            $pos={pos2}
            onError={(e) => {
              e.target.src = "/camisretro.jpg";
              e.target.onerror = null;
            }}
          />
        </BgHalf>
      </BgSplit>

      <Content>
        <TopBar>
          <BackLink to="/products">← Volver al catalogo</BackLink>
        </TopBar>

        <TeamHeader>
          <TeamTag>Camisetas Retro</TeamTag>
          <TeamName>{decodedBrand}</TeamName>
          <Count>
            {products.length} camiseta{products.length !== 1 ? "s" : ""} disponible{products.length !== 1 ? "s" : ""}
          </Count>
        </TeamHeader>

        {loading ? (
          <SkeletonGrid count={4} columns={4} />
        ) : products.length === 0 ? (
          <Empty>No hay camisetas disponibles para {decodedBrand}</Empty>
        ) : (
          <Grid data-count={products.length}>
            {products.map((p) => (
              <CardWrapper key={p._id}>
                <ProductCard product={p} />
              </CardWrapper>
            ))}
          </Grid>
        )}
      </Content>
    </PageWrapper>
  );
};

export default TeamPage;