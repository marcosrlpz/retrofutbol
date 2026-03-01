import { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import styled, { css } from "styled-components";
import toast from "react-hot-toast";
import { getProductByIdService, getAllProductsService } from "../services/product.service";
import useFetch from "../hooks/useFetch";
import useCart from "../hooks/useCart";
import Loader from "../components/ui/Loader";
import ProductCard from "../components/ui/ProductCard";
import ReviewSection from "../components/ui/ReviewSection";

/* ─── ZOOM MODAL ─────────────────────────────────────────────────── */
const ZoomOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: zoom-out;
`;

const ZoomImg = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 80px rgba(0,0,0,0.5);
`;

const ZoomCloseBtn = styled.button`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: white;
  color: #111827;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  z-index: 501;
  transition: var(--transition);
  &:hover { background: #f5f0e8; }
`;

/* ─── BREADCRUMBS ────────────────────────────────────────────────── */
const Breadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
`;
const Crumb = styled(Link)`
  color: var(--color-text-muted);
  transition: var(--transition);
  &:hover { color: var(--color-accent); }
`;
const CrumbSep = styled.span`color: var(--color-border);`;
const CrumbCurrent = styled.span`
  color: var(--color-text);
  font-weight: 600;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* ─── MAIN LAYOUT ─────────────────────────────────────────────────── */
const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-text-muted);
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xl);
  transition: var(--transition);
  &:hover { color: var(--color-accent); }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const ImageWrapper = styled.div`
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 3/4;
  background: #f5f5f5;
  cursor: zoom-in;
  group: true;

  &:hover .zoom-hint {
    opacity: 1;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
  ${ImageWrapper}:hover & { transform: scale(1.03); }
`;

const ZoomHint = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0,0,0,0.6);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  ${ImageWrapper}:hover & { opacity: 1; }
`;

/* ─── INFO PANEL ──────────────────────────────────────────────────── */
const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const LeagueTag = styled.span`
  display: inline-block;
  background: #111827;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-sm);
`;

const Club = styled.p`
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  margin-top: var(--spacing-xs);
`;

const Name = styled.h1`
  font-size: var(--font-size-3xl);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
`;

const Temporada = styled.p`
  font-size: 0.9rem;
  color: var(--color-text-muted);
`;

const Price = styled.p`
  font-size: 2.4rem;
  font-weight: 800;
`;

const Description = styled.p`
  color: var(--color-text-muted);
  line-height: 1.7;
  font-size: 0.95rem;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--color-border);
`;

const Stock = styled.p`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ $ok }) => $ok ? "var(--color-success)" : "var(--color-danger)"};
`;

/* ─── DESCRIPCIÓN Y INFO ADICIONAL ───────────────────────────────── */
const InfoTabs = styled.div`
  margin-top: var(--spacing-3xl);
  border-top: 2px solid var(--color-primary);
  padding-top: var(--spacing-xl);
`;

const TabsHeader = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-xl);
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 2px solid ${({ $active }) => $active ? "#111827" : "transparent"};
  color: ${({ $active }) => $active ? "#111827" : "var(--color-text-muted)"};
  transition: var(--transition);
  margin-bottom: -1px;
  font-family: var(--font-family);
  &:hover { color: #111827; }
`;

const TabContent = styled.div`
  color: var(--color-text-muted);
  line-height: 1.8;
  font-size: 0.95rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm);
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
`;

const InfoRowLabel = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  min-width: 80px;
`;

const InfoRowValue = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
`;

/* ─── PERSONALIZADOR ──────────────────────────────────────────────── */
const CustomSection = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
`;

const CustomHeader = styled.div`
  background: #111827;
  color: white;
  padding: 0.75rem var(--spacing-lg);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CustomBody = styled.div`
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const CustomRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const CustomField = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const CustomLabel = styled.label`
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const CustomInput = styled.input`
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.6rem 0.9rem;
  color: var(--color-text);
  font-size: 0.9rem;
  font-family: var(--font-family);
  transition: var(--transition);
  &:focus { outline: none; border-color: var(--color-primary); }
`;

const CustomSelect = styled.select`
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.6rem 0.9rem;
  color: var(--color-text);
  font-size: 0.9rem;
  font-family: var(--font-family);
  cursor: pointer;
  transition: var(--transition);
  &:focus { outline: none; border-color: var(--color-primary); }
`;

const SizeGrid = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const SizeBtn = styled.button`
  width: 46px;
  height: 40px;
  border-radius: var(--radius-md);
  border: 1.5px solid ${({ $active }) => $active ? "#111827" : "var(--color-border)"};
  background: ${({ $active }) => $active ? "#111827" : "white"};
  color: ${({ $active }) => $active ? "white" : "var(--color-text)"};
  font-size: 0.8rem;
  font-weight: 700;
  transition: var(--transition);
  font-family: var(--font-family);
  &:hover { border-color: #111827; }
`;

const SizeGuideBtn = styled.button`
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-accent);
  text-decoration: underline;
  transition: var(--transition);
  &:hover { color: var(--color-accent-dark); }
`;

/* ─── CTA ─────────────────────────────────────────────────────────── */
const AddBtn = styled.button`
  background: #111827;
  color: white;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 1rem 2rem;
  border-radius: var(--radius-md);
  transition: var(--transition);
  letter-spacing: 0.02em;
  width: 100%;
  &:hover:not(:disabled) { background: var(--color-accent); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

/* ─── RELATED PRODUCTS ────────────────────────────────────────────── */
const RelatedSection = styled.section`
  margin-top: var(--spacing-3xl);
  border-top: 2px solid var(--color-primary);
  padding-top: var(--spacing-xl);
`;

const RelatedTitle = styled.h2`
  font-size: var(--font-size-xl);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: var(--spacing-xl);
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); gap: var(--spacing-sm); }
`;

const ErrorMsg = styled.div`
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-muted);
`;

/* ─── SIZE GUIDE MODAL ────────────────────────────────────────────── */
const SizeGuideOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const SizeGuideCard = styled.div`
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  max-width: 500px;
  width: 100%;
  box-shadow: var(--shadow-lg);
`;

const SizeGuideTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 800;
  margin-bottom: var(--spacing-lg);
  text-transform: uppercase;
`;

const SizeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  th, td {
    padding: 0.6rem 1rem;
    text-align: center;
    border-bottom: 1px solid var(--color-border);
  }
  th {
    background: var(--color-bg-secondary);
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.72rem;
    letter-spacing: 0.06em;
  }
`;

const CloseGuideBtn = styled.button`
  margin-top: var(--spacing-lg);
  width: 100%;
  padding: 0.75rem;
  background: #111827;
  color: white;
  border-radius: var(--radius-md);
  font-weight: 700;
  transition: var(--transition);
  &:hover { background: var(--color-accent); }
`;

const SIZES = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"];
const PATCHES = ["Sin parches", "Champions League", "Copa del Rey", "FA Cup", "Serie A", "Bundesliga", "Liga Europa"];

const sizeGuideData = [
  { size: "S",   ancho: "49-51", largo: "67-69", altura: "1,65-1,70" },
  { size: "M",   ancho: "51-53", largo: "69-71", altura: "1,70-1,75" },
  { size: "L",   ancho: "53-55", largo: "71-73", altura: "1,75-1,80" },
  { size: "XL",  ancho: "55-57", largo: "73-76", altura: "1,80-1,85" },
  { size: "2XL", ancho: "58-60", largo: "77-79", altura: "1,85-1,90" },
  { size: "3XL", ancho: "60-62", largo: "80-82", altura: "1,90-1,95" },
  { size: "4XL", ancho: "62-64", largo: "82-84", altura: "1,95-2,00" },
];

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();

  const { data, loading, error } = useFetch(() => getProductByIdService(id), [id]);
  const product = data?.product;

  const fetchRelated = useCallback(() => {
    if (!product?.brand) return Promise.resolve({ products: [] });
    return getAllProductsService({ brand: product.brand, limit: 10 });
  }, [product?.brand]);
  const { data: relatedData } = useFetch(fetchRelated, [product?.brand]);
  const related = (relatedData?.products || []).filter(p => p._id !== id).slice(0, 4);

  const [selectedSize, setSelectedSize] = useState("");
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [selectedPatch, setSelectedPatch] = useState("Sin parches");
  const [showZoom, setShowZoom] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState("descripcion");

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Por favor selecciona una talla");
      return;
    }
    const customization = {
      size: selectedSize,
      ...(customName.trim() && { name: customName.trim().toUpperCase() }),
      ...(customNumber.trim() && { number: customNumber.trim() }),
      ...(selectedPatch !== "Sin parches" && { patch: selectedPatch }),
    };
    addItem({ ...product, customization });
  };

  if (loading) return <Loader />;
  if (error || !product) return <ErrorMsg>❌ Camiseta no encontrada</ErrorMsg>;

  const priceWithCustomization = customName.trim() || customNumber.trim()
    ? product.price + 5
    : product.price;

  const genderLabel = product.gender === "male" ? "Hombre" : product.gender === "female" ? "Mujer" : product.gender || "Unisex";

  return (
    <>
      {/* ── SEO ──────────────────────────────────────────────────── */}
      <Helmet>
        <title>{product.name} | RetroFútbol</title>
        <meta
          name="description"
          content={`${product.name} de ${product.brand}${product.temporada ? ` — Temporada ${product.temporada}` : ""}. ${product.description?.slice(0, 120) || "Camiseta retro auténtica de alta calidad."}. Solo ${product.price?.toFixed(2)}€.`}
        />
        <meta property="og:title" content={`${product.name} | RetroFútbol`} />
        <meta property="og:description" content={`${product.name} de ${product.brand}. Solo ${product.price?.toFixed(2)}€. Envío rápido.`} />
        <meta property="og:image" content={product.image_url} />
        <meta property="og:type" content="product" />
      </Helmet>

      {showZoom && (
        <ZoomOverlay onClick={() => setShowZoom(false)}>
          <ZoomCloseBtn onClick={() => setShowZoom(false)}>✕</ZoomCloseBtn>
          <ZoomImg
            src={product.image_url || "/camisretro.jpg"}
            alt={product.name}
            onClick={e => e.stopPropagation()}
          />
        </ZoomOverlay>
      )}

      {showSizeGuide && (
        <SizeGuideOverlay onClick={() => setShowSizeGuide(false)}>
          <SizeGuideCard onClick={e => e.stopPropagation()}>
            <SizeGuideTitle>📏 Guía de tallas</SizeGuideTitle>
            <SizeTable>
              <thead>
                <tr>
                  <th>Talla</th>
                  <th>Ancho (cm)</th>
                  <th>Largo (cm)</th>
                  <th>Altura (m)</th>
                </tr>
              </thead>
              <tbody>
                {sizeGuideData.map(r => (
                  <tr key={r.size}>
                    <td><strong>{r.size}</strong></td>
                    <td>{r.ancho}</td>
                    <td>{r.largo}</td>
                    <td>{r.altura}</td>
                  </tr>
                ))}
              </tbody>
            </SizeTable>
            <CloseGuideBtn onClick={() => setShowSizeGuide(false)}>Cerrar</CloseGuideBtn>
          </SizeGuideCard>
        </SizeGuideOverlay>
      )}

      <Breadcrumbs>
        <Crumb to="/">Inicio</Crumb>
        <CrumbSep>›</CrumbSep>
        <Crumb to="/products">Catálogo</Crumb>
        {product.category && (
          <><CrumbSep>›</CrumbSep><Crumb to={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Crumb></>
        )}
        {product.brand && (
          <><CrumbSep>›</CrumbSep><Crumb to={`/team/${encodeURIComponent(product.brand)}`}>{product.brand}</Crumb></>
        )}
        <CrumbSep>›</CrumbSep>
        <CrumbCurrent>{product.name}</CrumbCurrent>
      </Breadcrumbs>

      <BackLink to="/products">← Volver al catálogo</BackLink>

      <Layout>
        <ImageWrapper onClick={() => setShowZoom(true)}>
          <Image src={product.image_url || "/camisretro.jpg"} alt={product.name} />
          <ZoomHint className="zoom-hint">🔍 Ver en detalle</ZoomHint>
        </ImageWrapper>

        <Info>
          <div>
            <LeagueTag>{product.category}</LeagueTag>
            <Club>{product.brand}</Club>
            <Name>{product.name}</Name>
            {product.temporada && <Temporada>Temporada {product.temporada}</Temporada>}
          </div>

          <div>
            <Price>
              {priceWithCustomization.toFixed(2)} €
              {(customName.trim() || customNumber.trim()) && (
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 500, marginLeft: "0.5rem" }}>
                  (incl. personalización +5€)
                </span>
              )}
            </Price>
          </div>

          <Description>{product.description}</Description>
          <Divider />

          <CustomSection>
            <CustomHeader>✂️ Personaliza tu camiseta</CustomHeader>
            <CustomBody>
              <CustomField>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <CustomLabel>
                    Talla {selectedSize ? `— ${selectedSize}` : <span style={{ color: "var(--color-danger)" }}>*</span>}
                  </CustomLabel>
                  <SizeGuideBtn type="button" onClick={() => setShowSizeGuide(true)}>
                    📏 Ver guía de tallas
                  </SizeGuideBtn>
                </div>
                <SizeGrid>
                  {SIZES.map(s => (
                    <SizeBtn key={s} $active={selectedSize === s} onClick={() => setSelectedSize(s)} type="button">{s}</SizeBtn>
                  ))}
                </SizeGrid>
              </CustomField>

              <CustomRow>
                <CustomField>
                  <CustomLabel>Nombre (dorsal)</CustomLabel>
                  <CustomInput placeholder="Nombre de jugador/personal" value={customName} onChange={e => setCustomName(e.target.value)} maxLength={14} />
                </CustomField>
                <CustomField>
                  <CustomLabel>Número (dorsal)</CustomLabel>
                  <CustomInput placeholder="Número del dorsal" value={customNumber} onChange={e => setCustomNumber(e.target.value.replace(/[^0-9]/g, ""))} maxLength={2} type="text" inputMode="numeric" />
                </CustomField>
              </CustomRow>

              <CustomField>
                <CustomLabel>Parches</CustomLabel>
                <CustomSelect value={selectedPatch} onChange={e => setSelectedPatch(e.target.value)}>
                  {PATCHES.map(p => (<option key={p} value={p}>{p}</option>))}
                </CustomSelect>
              </CustomField>

              {(customName.trim() || customNumber.trim() || selectedPatch !== "Sin parches") && (
                <div style={{ background: "white", border: "1px dashed var(--color-border)", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", fontSize: "0.82rem", color: "var(--color-text-muted)", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {customName.trim() && <span>👤 <strong>{customName.trim().toUpperCase()}</strong></span>}
                  {customNumber.trim() && <span>🔢 <strong>#{customNumber}</strong></span>}
                  {selectedPatch !== "Sin parches" && <span>🏆 <strong>{selectedPatch}</strong></span>}
                </div>
              )}
            </CustomBody>
          </CustomSection>

          <Stock $ok={product.stock > 0}>
            {product.stock > 0 ? `✅ En stock (${product.stock} uds)` : "❌ Agotado"}
          </Stock>

          <AddBtn onClick={handleAddToCart} disabled={product.stock === 0}>
            🛒 {product.stock === 0 ? "Agotado" : "Añadir al carrito"}
          </AddBtn>
        </Info>
      </Layout>

      {/* ── TABS: DESCRIPCIÓN + INFO ADICIONAL ───────────────────── */}
      <InfoTabs>
        <TabsHeader>
          <Tab $active={activeTab === "descripcion"} onClick={() => setActiveTab("descripcion")}>
            📋 Descripción
          </Tab>
            <Tab $active={activeTab === "info"} onClick={() => setActiveTab("info")}>
            ℹ️ Información adicional
          </Tab>
          <Tab $active={activeTab === "tallas"} onClick={() => setActiveTab("tallas")}>
            📏 Guía de tallas
          </Tab>
        </TabsHeader>

        <TabContent>
          {activeTab === "descripcion" && (
            <p style={{ maxWidth: "700px", lineHeight: "1.8" }}>
              {product.description ||
                `La ${product.name} es una pieza histórica del fútbol. Una camiseta auténtica que captura la esencia de una época dorada del deporte rey. Confeccionada con materiales de alta calidad que reproducen fielmente el diseño original, perfecta tanto para coleccionistas como para aficionados que quieren llevar un trozo de historia.`}
            </p>
          )}

          {activeTab === "tallas" && (
            <div style={{ overflowX: "auto" }}>
              <p style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
                Medidas orientativas en centímetros. Si estás entre dos tallas, te recomendamos elegir la mayor.
              </p>
              <SizeTable style={{ maxWidth: "600px" }}>
                <thead>
                  <tr>
                    <th>Talla</th>
                    <th>Ancho (cm)</th>
                    <th>Largo (cm)</th>
                    <th>Altura (m)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeGuideData.map(r => (
                    <tr key={r.size}>
                      <td><strong>{r.size}</strong></td>
                      <td>{r.ancho}</td>
                      <td>{r.largo}</td>
                      <td>{r.altura}</td>
                    </tr>
                  ))}
                </tbody>
              </SizeTable>
              <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                💡 Las camisetas de fútbol retro suelen tener un corte más ajustado que las modernas. Si prefieres un ajuste holgado, sube una talla.
              </p>
            </div>
          )}

          {activeTab === "info" && (
            <InfoGrid>
              {product.brand && (
                <InfoRow>
                  <InfoRowLabel>🏟️ Club</InfoRowLabel>
                  <InfoRowValue>{product.brand}</InfoRowValue>
                </InfoRow>
              )}
              {product.temporada && (
                <InfoRow>
                  <InfoRowLabel>📅 Temporada</InfoRowLabel>
                  <InfoRowValue>{product.temporada}</InfoRowValue>
                </InfoRow>
              )}
              {product.category && (
                <InfoRow>
                  <InfoRowLabel>🏆 Liga</InfoRowLabel>
                  <InfoRowValue>{product.category}</InfoRowValue>
                </InfoRow>
              )}
              {product.gender && (
                <InfoRow>
                  <InfoRowLabel>👤 Género</InfoRowLabel>
                  <InfoRowValue>{genderLabel}</InfoRowValue>
                </InfoRow>
              )}
              {product.color && (
                <InfoRow>
                  <InfoRowLabel>🎨 Color</InfoRowLabel>
                  <InfoRowValue style={{ textTransform: "capitalize" }}>{product.color}</InfoRowValue>
                </InfoRow>
              )}
              <InfoRow>
                <InfoRowLabel>👕 Material</InfoRowLabel>
                <InfoRowValue>100% Poliéster</InfoRowValue>
              </InfoRow>
              <InfoRow>
                <InfoRowLabel>🌍 Origen</InfoRowLabel>
                <InfoRowValue>Réplica premium</InfoRowValue>
              </InfoRow>
              <InfoRow>
                <InfoRowLabel>✂️ Personalizable</InfoRowLabel>
                <InfoRowValue>Sí — nombre, número y parche</InfoRowValue>
              </InfoRow>
            </InfoGrid>
          )}
        </TabContent>
      </InfoTabs>

      {related.length > 0 && (
        <RelatedSection>
          <RelatedTitle>Otras camisetas de {product.brand}</RelatedTitle>
          <RelatedGrid>
            {related.map(p => (<ProductCard key={p._id} product={p} />))}
          </RelatedGrid>
        </RelatedSection>
      )}

      <ReviewSection productId={id} productRating={product.rating} />
    </>
  );
};

export default ProductDetail;