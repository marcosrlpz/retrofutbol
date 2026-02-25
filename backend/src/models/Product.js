const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["La Liga", "Premier League", "Serie A", "Bundesliga", "Otros Paises", "Selecciones"],
    },
    brand: { type: String, required: true, trim: true },
    temporada: { type: String, trim: true },
    talla: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    color: { type: String, trim: true },
    gender: {
      type: String,
      enum: ["Hombre", "Mujer", "Unisex", "Junior"],
      default: "Hombre",
    },
    stock: { type: Number, required: true, min: 0, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 4.0 },
    image_url: { type: String, default: "" },
    cloudinary_id: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);