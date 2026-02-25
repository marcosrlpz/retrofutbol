import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);

// Clave de localStorage basada en el userId
const getCartKey = (userId) => userId ? `cart_${userId}` : "cart_guest";

const getInitialItems = (userId) => {
  try {
    const key = getCartKey(userId);
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { customization, ...product } = action.payload;
      // Clave única: productId + talla + nombre + número (para permitir misma camiseta con diferente personalización)
      const key = `${product._id}_${customization?.size || ""}_${customization?.name || ""}_${customization?.number || ""}`;
      const exists = state.items.find((i) => i.key === key);
      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.key === key ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { key, product, customization: customization || null, quantity: 1 }],
      };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.key !== action.payload) };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.key === action.payload.key
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "LOAD_CART":
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

export const CartProvider = ({ children, userId }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: getInitialItems(userId) });

  // Cuando cambia el userId (login/logout), cargar el carrito correspondiente
  useEffect(() => {
    const savedItems = getInitialItems(userId);
    dispatch({ type: "LOAD_CART", payload: savedItems });
  }, [userId]);

  // Persistir en localStorage con clave por usuario
  useEffect(() => {
    const key = getCartKey(userId);
    localStorage.setItem(key, JSON.stringify(state.items));
  }, [state.items, userId]);

  const addItem = useCallback((product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  }, []);

  const removeItem = useCallback((key) => {
    dispatch({ type: "REMOVE_ITEM", payload: key });
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    if (quantity < 1) {
      dispatch({ type: "REMOVE_ITEM", payload: key });
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { key, quantity } });
    }
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const value = useMemo(() => ({
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems: state.items.reduce((acc, i) => acc + i.quantity, 0),
    totalPrice: state.items.reduce((acc, i) => {
      const extra = (i.customization?.name || i.customization?.number) ? 5 : 0;
      return acc + (i.product.price + extra) * i.quantity;
    }, 0),
  }), [state.items, addItem, removeItem, updateQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
};

export default CartContext;