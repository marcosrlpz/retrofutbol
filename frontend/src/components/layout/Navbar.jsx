import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../context/AuthContext";
import useCart from "../../hooks/useCart";
import { useWishlist } from "../../context/WishlistContext";
import { getAllProductsService } from "../../services/product.service";

const leagues = [
  { name: "La Liga", teams: ["Athletic Club Bilbao", "Barcelona", "Betis", "Cadiz", "Deportivo de la Coruña", "Madrid", "Numancia", "Recreativo de Huelva", "Valencia"] },
  { name: "Premier League", teams: ["Arsenal", "Chelsea", "Liverpool", "Manchester City", "Manchester United"] },
  { name: "Serie A", teams: ["AC Milan", "AS Roma", "Fiorentina", "Inter de Milan"] },
  { name: "Bundesliga", teams: ["Bayer Leverkusen", "Bayern Munich", "Borussia Dortmund", "FC Schalke 04", "Werder Bremen"] },
  { name: "Otros Paises", teams: ["Ajax", "Benfica", "Olympique de Lyon", "Olympique de Marsella", "PSG", "Santos"] },
  { name: "Selecciones", teams: ["Alemania", "Argentina", "Brasil", "France", "Nigeria", "Paises Bajos", "España"] },
];

const MESSAGES = [
  { icon: "🚚", text: "Envío gratis en pedidos superiores a", highlight: "75€" },
  { icon: "↩️", text: "Devoluciones gratuitas en", highlight: "30 días" },
  { icon: "✂️", text: "Personalización de camisetas:", highlight: "nombre + número + parche" },
  { icon: "⭐", text: "Más de", highlight: "100 camisetas retro" },
];

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const TopBar = styled.div`
  background: #1a2e1a;
  color: rgba(255,255,255,0.85);
  font-size: 0.72rem;
  font-weight: 500;
  text-align: center;
  padding: 0.5rem;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
`;

const Message = styled.span`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  animation: ${fadeIn} 0.4s ease;
  span { color: #c9a84c; font-weight: 700; }
`;

const Dots = styled.div`
  display: flex;
  gap: 0.4rem;
  position: absolute;
  right: 1rem;
`;

const Dot = styled.button`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${({ $active }) => $active ? "#c9a84c" : "rgba(255,255,255,0.3)"};
  transition: background 0.3s;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 200;
  background: #f5f0e8;
  border-bottom: 2px solid #2d4a2d;
  box-shadow: 0 2px 12px rgba(45,74,45,0.1);
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
  @media (max-width: 768px) {
    padding: 0 0.75rem;
    gap: 0.25rem;
  }
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  white-space: nowrap;
  flex-shrink: 0;
  img {
    height: 70px;
    width: 220px;
    object-fit: contain;
    object-position: left center;
    @media (max-width: 768px) {
      width: 120px;
      height: 42px;
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  @media (max-width: 1100px) { display: none; }
`;

const SearchWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  @media (max-width: 768px) { display: none; }
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  background: white;
  border: 1.5px solid ${({ $focused }) => $focused ? "#2d4a2d" : "#c4b89a"};
  border-radius: var(--radius-full);
  padding: 0.3rem 0.3rem 0.3rem 1rem;
  gap: 0.5rem;
  transition: var(--transition);
  box-shadow: ${({ $focused }) => $focused ? "0 0 0 3px rgba(45,74,45,0.1)" : "none"};
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  outline: none;
  font-size: 0.82rem;
  color: #2d4a2d;
  width: 180px;
  &::placeholder { color: #8a9a7a; }
`;

const SearchBtn = styled.button`
  width: 28px; height: 28px;
  background: #2d4a2d;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  transition: var(--transition);
  flex-shrink: 0;
  &:hover { background: #c9a84c; }
`;

const Suggestions = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #c4b89a;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  z-index: 400;
  max-height: 360px;
  overflow-y: auto;
`;

const SuggestionItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: 0.65rem 1rem;
  transition: var(--transition);
  border-bottom: 1px solid #f0ebe0;
  &:last-child { border-bottom: none; }
  &:hover { background: #f5f0e8; }
`;

const SuggestionImg   = styled.img`width: 40px; height: 40px; object-fit: contain; border-radius: var(--radius-sm); background: #f5f0e8; flex-shrink: 0;`;
const SuggestionInfo  = styled.div`flex: 1; min-width: 0;`;
const SuggestionName  = styled.p`font-size: 0.82rem; font-weight: 700; color: #2d4a2d; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;
const SuggestionMeta  = styled.p`font-size: 0.72rem; color: #5a6b4a;`;
const SuggestionPrice = styled.p`font-size: 0.82rem; font-weight: 800; color: #2d4a2d; flex-shrink: 0;`;
const SuggestionHeader = styled.div`padding: 0.4rem 1rem; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #8a9a7a; background: #f5f0e8; border-bottom: 1px solid #e0d9cc;`;
const NoResults = styled.div`padding: 1rem; text-align: center; font-size: 0.82rem; color: #8a9a7a;`;

const DropdownWrapper = styled.div`position: relative;`;

const NavBtn = styled.button`
  padding: 0 0.8rem;
  height: var(--navbar-height);
  font-size: 0.72rem;
  font-weight: 700;
  color: #2d4a2d;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.3rem;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  &:hover, &.open { color: #c9a84c; border-bottom-color: #c9a84c; }
  &::after { content: "▾"; font-size: 0.6rem; }
`;

const DropMenu = styled.div`
  position: absolute;
  top: calc(var(--navbar-height) - 1px);
  left: 50%;
  transform: translateX(-50%);
  background: #f5f0e8;
  border: 1px solid #c4b89a;
  border-top: 2px solid #2d4a2d;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  box-shadow: var(--shadow-lg);
  min-width: 210px;
  padding: var(--spacing-sm) 0;
  z-index: 300;
`;

const DropItem = styled(Link)`
  display: block;
  padding: 0.55rem 1.2rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #2d4a2d;
  transition: var(--transition);
  &:hover { background: rgba(45,74,45,0.08); color: #c9a84c; padding-left: 1.5rem; }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  @media (max-width: 768px) {
    gap: 0.1rem;
  }
`;

const IconBtn = styled(Link)`
  position: relative;
  width: 40px; height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2d4a2d;
  transition: var(--transition);
  &:hover { background: rgba(45,74,45,0.1); }
  @media (max-width: 768px) {
    width: 34px; height: 34px;
  }
`;

const WishIconBtn = styled(Link)`
  position: relative;
  width: 40px; height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: var(--transition);
  &:hover { background: rgba(45,74,45,0.1); transform: scale(1.1); }
  @media (max-width: 768px) {
    width: 34px; height: 34px;
    font-size: 1rem;
  }
`;

const WishBadge = styled.span`
  position: absolute;
  top: 2px; right: 2px;
  background: #dc2626;
  color: white;
  font-size: 0.6rem; font-weight: 800;
  width: 16px; height: 16px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
`;

const LogoutBtn = styled.button`
  width: 40px; height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2d4a2d;
  font-size: 1rem;
  transition: var(--transition);
  border: 1.5px solid transparent;
  &:hover { background: rgba(45,74,45,0.1); border-color: #2d4a2d; }
  svg { stroke: #2d4a2d; }
  @media (max-width: 768px) {
    width: 34px; height: 34px;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 2px; right: 2px;
  background: #2d4a2d;
  color: #f5f0e8;
  font-size: 0.6rem; font-weight: 800;
  width: 16px; height: 16px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
`;

const LoginBtn = styled(Link)`
  padding: 0.5rem 1.1rem;
  background: #2d4a2d;
  color: #f5f0e8;
  font-size: 0.8rem; font-weight: 700;
  border-radius: var(--radius-md);
  transition: var(--transition);
  white-space: nowrap;
  &:hover { background: #c9a84c; color: #1a2e1a; }
  @media (max-width: 768px) {
    padding: 0.4rem 0.75rem;
    font-size: 0.75rem;
  }
`;

const MobileBtn = styled.button`
  display: none;
  width: 38px; height: 38px;
  border-radius: var(--radius-md);
  border: 1px solid #c4b89a;
  align-items: center; justify-content: center;
  font-size: 1.1rem; color: #2d4a2d;
  flex-shrink: 0;
  @media (max-width: 1100px) { display: flex; }
`;

const MobileMenu = styled.div`
  display: none;
  @media (max-width: 1100px) {
    display: ${({ $open }) => $open ? "block" : "none"};
    background: #f5f0e8;
    border-bottom: 1px solid #c4b89a;
    max-height: 80vh; overflow-y: auto;
  }
`;

const MobileSearchWrapper = styled.div`padding: var(--spacing-md) var(--spacing-lg); border-bottom: 1px solid #c4b89a;`;
const MobileLeague    = styled.div`border-bottom: 1px solid #c4b89a;`;
const MobileLeagueBtn = styled.button`width: 100%; text-align: left; padding: 0.9rem 1.5rem; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2d4a2d; display: flex; justify-content: space-between;`;
const MobileTeams     = styled.div`display: ${({ $open }) => $open ? "block" : "none"}; background: #ede8dc;`;
const MobileTeamLink  = styled(Link)`display: block; padding: 0.6rem 2rem; font-size: 0.85rem; color: #5a6b4a; &:hover { color: #c9a84c; }`;

const MobileWishlistLink = styled(Link)`
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.9rem 1.5rem;
  font-size: 0.85rem; font-weight: 700;
  color: #2d4a2d;
  border-bottom: 1px solid #c4b89a;
  &:hover { color: #c9a84c; }
`;

const DropdownItem = ({ league }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <DropdownWrapper ref={ref}>
      <NavBtn className={open ? "open" : ""} onClick={() => setOpen(v => !v)}>{league.name}</NavBtn>
      {open && (
        <DropMenu>
          {league.teams.map(team => (
            <DropItem key={team} to={`/team/${encodeURIComponent(team)}`} onClick={() => setOpen(false)}>
              {team}
            </DropItem>
          ))}
        </DropMenu>
      )}
    </DropdownWrapper>
  );
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileLeague, setMobileLeague] = useState(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const searchRef = useRef();
  const debounceRef = useRef();
  const navigate = useNavigate();
  const { logout, isAdmin, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const h = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setFocused(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (search.trim().length < 2) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await getAllProductsService({ search: search.trim(), limit: 8 });
        setSuggestions(data.products || []);
      } catch { setSuggestions([]); }
      setLoading(false);
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch(""); setSuggestions([]); setFocused(false); setMobileOpen(false);
    }
  };

  const handleSuggestionClick = () => {
    setSearch(""); setSuggestions([]); setFocused(false);
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const showSuggestions = focused && search.trim().length >= 2;
  const msg = MESSAGES[msgIndex];

  return (
    <>
      <TopBar>
        <Message key={msgIndex}>
          {msg.icon} {msg.text} <span>{msg.highlight}</span>
        </Message>
        <Dots>
          {MESSAGES.map((_, i) => (
            <Dot key={i} $active={i === msgIndex} onClick={() => setMsgIndex(i)} />
          ))}
        </Dots>
      </TopBar>
      <Header>
        <Container>
          <Brand to="/">
            <img src="/logorf.png" alt="RetroFutbol" onError={e => { e.target.style.display = "none"; }} />
          </Brand>

          <Nav>
            {leagues.map(league => <DropdownItem key={league.name} league={league} />)}
          </Nav>

          <SearchWrapper ref={searchRef}>
            <SearchForm onSubmit={handleSearch} $focused={focused}>
              <SearchInput
                placeholder="Buscar camiseta o equipo..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setFocused(true)}
              />
              <SearchBtn type="submit">🔍</SearchBtn>
            </SearchForm>
            {showSuggestions && (
              <Suggestions>
                {loading ? (
                  <NoResults>Buscando...</NoResults>
                ) : suggestions.length === 0 ? (
                  <NoResults>No se encontraron resultados para "{search}"</NoResults>
                ) : (
                  <>
                    <SuggestionHeader>{suggestions.length} resultado{suggestions.length !== 1 ? "s" : ""}</SuggestionHeader>
                    {suggestions.map(p => (
                      <SuggestionItem key={p._id} to={`/products/${p._id}`} onClick={handleSuggestionClick}>
                        <SuggestionImg src={p.image_url} alt={p.name} onError={e => { e.target.src = "/camisretro.jpg"; }} />
                        <SuggestionInfo>
                          <SuggestionName>{p.name}</SuggestionName>
                          <SuggestionMeta>{p.brand} · {p.temporada}</SuggestionMeta>
                        </SuggestionInfo>
                        <SuggestionPrice>{p.price?.toFixed(2)} €</SuggestionPrice>
                      </SuggestionItem>
                    ))}
                  </>
                )}
              </Suggestions>
            )}
          </SearchWrapper>

          <Actions>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <IconBtn to="/admin" title="Panel admin">👑</IconBtn>
                )}
                <LogoutBtn onClick={handleLogout} title="Cerrar sesión">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </LogoutBtn>
              </>
            ) : (
              <LoginBtn to="/login">Entrar</LoginBtn>
            )}
            <IconBtn to="/profile" title="Mi perfil">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </IconBtn>

            <WishIconBtn to="/wishlist" title="Mis favoritos">
              {wishlist.length > 0 ? "❤️" : "🤍"}
              {wishlist.length > 0 && <WishBadge>{wishlist.length}</WishBadge>}
            </WishIconBtn>

            <IconBtn to="/cart" title="Mi carrito">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {totalItems > 0 && <Badge>{totalItems}</Badge>}
            </IconBtn>
            <MobileBtn onClick={() => setMobileOpen(v => !v)}>☰</MobileBtn>
          </Actions>
        </Container>
      </Header>

      <MobileMenu $open={mobileOpen}>
        <MobileSearchWrapper>
          <SearchForm onSubmit={handleSearch} $focused={false} style={{borderRadius:"8px"}}>
            <SearchInput placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} style={{width:"100%"}} />
            <SearchBtn type="submit">🔍</SearchBtn>
          </SearchForm>
        </MobileSearchWrapper>

        <MobileWishlistLink to="/wishlist" onClick={() => setMobileOpen(false)}>
          {wishlist.length > 0 ? "❤️" : "🤍"} Mis favoritos
          {wishlist.length > 0 && <span style={{ background: "#dc2626", color: "white", fontSize: "0.65rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: "999px" }}>{wishlist.length}</span>}
        </MobileWishlistLink>

        {leagues.map((league, i) => (
          <MobileLeague key={league.name}>
            <MobileLeagueBtn onClick={() => setMobileLeague(mobileLeague === i ? null : i)}>
              {league.name} <span>{mobileLeague === i ? "▲" : "▼"}</span>
            </MobileLeagueBtn>
            <MobileTeams $open={mobileLeague === i}>
              {league.teams.map(team => (
                <MobileTeamLink key={team} to={`/team/${encodeURIComponent(team)}`} onClick={() => setMobileOpen(false)}>
                  {team}
                </MobileTeamLink>
              ))}
            </MobileTeams>
          </MobileLeague>
        ))}
      </MobileMenu>
    </>
  );
};

export default Navbar;