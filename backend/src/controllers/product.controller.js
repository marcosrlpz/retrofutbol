const Product = require("../models/Product");

// Helpers
const escapeRegex = (s = "") => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normalize = (s = "") =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/ñ/g, "n");

const buildAccentInsensitiveRegex = (input = "") => {
  const norm = normalize(input);
  const pattern = escapeRegex(norm)
    .replace(/a/g, "[aáàäâ]")
    .replace(/e/g, "[eéèëê]")
    .replace(/i/g, "[iíìïî]")
    .replace(/o/g, "[oóòöô]")
    .replace(/u/g, "[uúùüû]")
    .replace(/n/g, "[nñ]");
  return new RegExp(pattern, "i");
};

// GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const { category, brand, search, sort, limit = 100 } = req.query;

    const filter = {};
    if (category) filter.category = category;

    // ✅ BRAND tolerante (Coruna / Coruña / mayúsculas)
    if (brand) {
      filter.brand = { $regex: buildAccentInsensitiveRegex(brand) };
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { name: regex },
        { brand: regex },
        { category: regex },
        { description: regex },
      ];
    }

    let sortObj = { createdAt: -1 };
    if (sort === "price_asc") sortObj = { price: 1 };
    else if (sort === "price_desc") sortObj = { price: -1 };
    else if (sort === "rating") sortObj = { rating: -1 };

    const products = await Product.find(filter).sort(sortObj).limit(Number(limit));

    res.json({ success: true, products, count: products.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Producto no encontrado" });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: "Producto no encontrado" });
    res.json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Producto no encontrado" });
    res.json({ success: true, message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };