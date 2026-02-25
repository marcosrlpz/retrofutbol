import { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import styled, { css } from "styled-components";
import toast from "react-hot-toast";
import { getProductByIdService, getAllProductsService } from "../services/product.service";
import useFetch from "../hooks/useFetch";
import useCart from "../hooks/useCart";
import Loader from "../components/ui/Loader";
import ProductCard from "../components/ui/ProductCard";

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

/* Selector de talla */
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

/* Guía tallas */
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

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const PATCHES = ["Sin parches", "Champions League", "Copa del Rey", "FA Cup", "Serie A", "Bundesliga", "Liga Europa"];

const sizeGuideData = [
  { size: "XS", chest: "84-88", waist: "70-74", height: "160-165" },
  { size: "S",  chest: "88-92", waist: "74-78", height: "165-170" },
  { size: "M",  chest: "92-96", waist: "78-82", height: "170-175" },
  { size: "L",  chest: "96-100", waist: "82-86", height: "175-180" },
  { size: "XL", chest: "100-104", waist: "86-90", height: "180-185" },
  { size: "XXL", chest: "104-110", waist: "90-96", height: "185-190" },
];

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();

  // Producto principal
  const { data, loading, error } = useFetch(() => getProductByIdService(id), [id]);
  const product = data?.product;

  // Productos relacionados (mismo equipo, excluyendo el actual)
  const fetchRelated = useCallback(() => {
    if (!product?.brand) return Promise.resolve({ products: [] });
    return getAllProductsService({ brand: product.brand, limit: 10 });
  }, [product?.brand]);
  const { data: relatedData } = useFetch(fetchRelated, [product?.brand]);
  const related = (relatedData?.products || []).filter(p => p._id !== id).slice(0, 4);

  // Personalizador state
  const [selectedSize, setSelectedSize] = useState("");
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [selectedPatch, setSelectedPatch] = useState("Sin parches");
  const [showZoom, setShowZoom] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

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

  return (
    <>
      {/* Zoom Modal */}
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

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <SizeGuideOverlay onClick={() => setShowSizeGuide(false)}>
          <SizeGuideCard onClick={e => e.stopPropagation()}>
            <SizeGuideTitle>📏 Guía de tallas</SizeGuideTitle>
            <SizeTable>
              <thead>
                <tr>
                  <th>Talla</th>
                  <th>Pecho (cm)</th>
                  <th>Cintura (cm)</th>
                  <th>Altura (cm)</th>
                </tr>
              </thead>
              <tbody>
                {sizeGuideData.map(r => (
                  <tr key={r.size}>
                    <td><strong>{r.size}</strong></td>
                    <td>{r.chest}</td>
                    <td>{r.waist}</td>
                    <td>{r.height}</td>
                  </tr>
                ))}
              </tbody>
            </SizeTable>
            <CloseGuideBtn onClick={() => setShowSizeGuide(false)}>Cerrar</CloseGuideBtn>
          </SizeGuideCard>
        </SizeGuideOverlay>
      )}

      <BackLink to="/products">← Volver al catálogo</BackLink>

      <Layout>
        {/* IMAGEN */}
        <ImageWrapper onClick={() => setShowZoom(true)}>
          <Image
            src={product.image_url || "/camisretro.jpg"}
            alt={product.name}
          />
          <ZoomHint className="zoom-hint">🔍 Ver en detalle</ZoomHint>
        </ImageWrapper>

        {/* INFO + PERSONALIZADOR */}
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

          {/* PERSONALIZADOR */}
          <CustomSection>
            <CustomHeader>
              ✂️ Personaliza tu camiseta
            </CustomHeader>
            <CustomBody>

              {/* TALLA */}
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
                    <SizeBtn
                      key={s}
                      $active={selectedSize === s}
                      onClick={() => setSelectedSize(s)}
                      type="button"
                    >
                      {s}
                    </SizeBtn>
                  ))}
                </SizeGrid>
              </CustomField>

              {/* NOMBRE Y NÚMERO */}
              <CustomRow>
                <CustomField>
                  <CustomLabel>Nombre (dorsal)</CustomLabel>
                  <CustomInput
                    placeholder="Nombre de jugador/personal"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    maxLength={14}
                  />
                </CustomField>
                <CustomField>
                  <CustomLabel>Número (dorsal)</CustomLabel>
                  <CustomInput
                    placeholder="Número del dorsal"
                    value={customNumber}
                    onChange={e => setCustomNumber(e.target.value.replace(/[^0-9]/g, ""))}
                    maxLength={2}
                    type="text"
                    inputMode="numeric"
                  />
                </CustomField>
              </CustomRow>

              {/* PARCHES */}
              <CustomField>
                <CustomLabel>Parches</CustomLabel>
                <CustomSelect
                  value={selectedPatch}
                  onChange={e => setSelectedPatch(e.target.value)}
                >
                  {PATCHES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </CustomSelect>
              </CustomField>

              {/* Preview personalización */}
              {(customName.trim() || customNumber.trim() || selectedPatch !== "Sin parches") && (
                <div style={{
                  background: "white",
                  border: "1px dashed var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.75rem 1rem",
                  fontSize: "0.82rem",
                  color: "var(--color-text-muted)",
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap"
                }}>
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

      {/* PRODUCTOS RELACIONADOS */}
      {related.length > 0 && (
        <RelatedSection>
          <RelatedTitle>Otras camisetas de {product.brand}</RelatedTitle>
          <RelatedGrid>
            {related.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </RelatedGrid>
        </RelatedSection>
      )}
    </>
  );
};

export default ProductDetail;