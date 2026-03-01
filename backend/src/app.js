const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes     = require("./routes/auth.routes");
const productRoutes  = require("./routes/product.routes");
const orderRoutes    = require("./routes/order.routes");
const contactRoutes  = require("./routes/contact.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const reviewRoutes   = require("./routes/review.routes");
const userRoutes     = require("./routes/user.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    // Permitir dominio exacto de la lista
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Permitir cualquier subdominio de Vercel (despliegues dinámicos)
    if (/^https:\/\/retrofutbol.*\.vercel\.app$/.test(origin)) return callback(null, true);
    callback(new Error(`CORS bloqueado para: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "⚽ RetroFútbol API funcionando correctamente" });
});

app.use("/api/auth",     authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/contact",  contactRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews",  reviewRoutes);
app.use("/api/users",    userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error interno del servidor", error: err.message });
});

module.exports = app;