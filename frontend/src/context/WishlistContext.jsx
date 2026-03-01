import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/auth.service";

const WishlistContext = createContext();

const STORAGE_KEY = "retrofutbol_wishlist";

const getStored = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [wishlist, setWishlist] = useState(getStored);
  const [synced, setSynced] = useState(false);

  // Al loguearse: cargar wishlist de BD y mergear con localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      setSynced(false);
      return;
    }
    const loadWishlist = async () => {
      try {
        const { data } = await api.get("/wishlist");
        const bdIds = data.wishlist.map(p => p._id || p);
        const local = getStored();
        // Merge: unir BD + localStorage sin duplicados
        const merged = [...new Set([...bdIds, ...local])];
        setWishlist(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        // Sincronizar los locales que no estaban en BD
        const onlyLocal = local.filter(id => !bdIds.includes(id));
        for (const productId of onlyLocal) {
          await api.post("/wishlist/toggle", { productId });
        }
        setSynced(true);
      } catch {
        // Si falla BD usamos localStorage
        setSynced(true);
      }
    };
    loadWishlist();
  }, [isAuthenticated, user?._id]);

  const toggle = useCallback(async (productId) => {
    // Optimistic update
    setWishlist(prev => {
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });

    // Sync con BD si está logueado
    if (isAuthenticated) {
      try {
        await api.post("/wishlist/toggle", { productId });
      } catch {
        // Si falla revertimos
        setWishlist(prev => {
          const reverted = prev.includes(productId)
            ? prev.filter(id => id !== productId)
            : [...prev, productId];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(reverted));
          return reverted;
        });
      }
    }
  }, [isAuthenticated]);

  const isWished = useCallback((productId) => wishlist.includes(productId), [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isWished, synced }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);