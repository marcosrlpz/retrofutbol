import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import GlobalStyles from "./styles/GlobalStyles";
import App from "./App";

// Wrapper que conecta AuthContext con CartProvider
const CartProviderWithAuth = ({ children }) => {
  const { user } = useAuth();
  return (
    <CartProvider userId={user?._id || user?.id || null}>
      {children}
    </CartProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProviderWithAuth>
            <GlobalStyles />
            <App />
          </CartProviderWithAuth>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);