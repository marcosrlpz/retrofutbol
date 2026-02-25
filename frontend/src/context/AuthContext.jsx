import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { getMeService, loginService, registerService } from "../services/auth.service";

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false, error: null };
    case "LOGOUT":
      return { ...state, user: null, token: null, loading: false, error: null };
    case "SET_USER":
      return { ...state, user: action.payload, loading: false };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Carga el usuario al iniciar si hay token
  useEffect(() => {
    const loadUser = async () => {
      if (!state.token) {
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }
      try {
        const data = await getMeService();
        dispatch({ type: "SET_USER", payload: data.user });
      } catch {
        localStorage.removeItem("token");
        dispatch({ type: "LOGOUT" });
      }
    };
    loadUser();
  }, []); // solo al montar

  // ── LOGIN ── devuelve { success: true } o { success: false, error: "..." }
  const login = useCallback(async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const data = await loginService({ email, password });
      localStorage.setItem("token", data.token);
      dispatch({ type: "LOGIN_SUCCESS", payload: data });
      return { success: true };
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      return {
        success: false,
        error: error.response?.data?.message || "Email o contraseña incorrectos",
      };
    }
  }, []);

  // ── REGISTER ── devuelve { success: true } o { success: false, error: "..." }
  const register = useCallback(async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const data = await registerService(userData);
      localStorage.setItem("token", data.token);
      dispatch({ type: "LOGIN_SUCCESS", payload: data });
      return { success: true };
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      return {
        success: false,
        error: error.response?.data?.message || "Error al registrarse",
      };
    }
  }, []);

  // ── LOGOUT ──
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  }, []);

  // ── UPDATE USER ── (para perfil)
  const updateUser = useCallback((user) => {
    dispatch({ type: "SET_USER", payload: user });
  }, []);

  const value = useMemo(() => ({
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateUser,
    isAdmin: state.user?.role === "admin",
    isAuthenticated: !!state.token,
  }), [state, login, register, logout, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

export default AuthContext;