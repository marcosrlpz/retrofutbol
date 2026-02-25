import { useCallback } from "react";
import { useCart as useCartContext } from "../context/CartContext";
import toast from "react-hot-toast";

const useCart = () => {
  const cart = useCartContext();

  const handleAddItem = useCallback((product) => {
    if (product.stock === 0) {
      toast.error("Producto sin stock disponible");
      return;
    }
    cart.addItem(product);
    toast.success(`${product.name} añadido al carrito`);
  }, [cart]);

  const handleRemoveItem = useCallback((productId, productName) => {
    cart.removeItem(productId);
    toast.success(`${productName} eliminado del carrito`);
  }, [cart]);

  const handleUpdateQuantity = useCallback((id, quantity) => {
    cart.updateQuantity(id, quantity);
  }, [cart]);

  const handleClearCart = useCallback(() => {
    cart.clearCart();
    toast.success("Carrito vaciado");
  }, [cart]);

  return {
    items: cart.items,
    totalItems: cart.totalItems,
    totalPrice: cart.totalPrice,
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
  };
};

export default useCart;