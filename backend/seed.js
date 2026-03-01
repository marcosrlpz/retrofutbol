/**
 * SEED SCRIPT — RetroFútbol
 * Lee el CSV de productos con fs y puebla la base de datos.
 *
 * Uso:
 *   node seed.js            → importa productos
 *   node seed.js --delete   → borra todos los productos
 */

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./src/models/Product");

const CSV_PATH = path.join(__dirname, "data", "products.csv");

// ── Parsear CSV con fs (sin librerías externas) ───────────────────
const parseCSV = (filePath) => {
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.replace(/\r/g, "").split("\n").filter(Boolean);
  const headers = lines[0].split(",");

  return lines.slice(1).map(line => {
    // Manejo correcto de campos con comas dentro de comillas
    const values = [];
    let current = "";
    let insideQuotes = false;

    for (const char of line) {
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const obj = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = values[i] || "";
    });
    return obj;
  });
};

// ── Conectar y seedear ────────────────────────────────────────────
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    if (process.argv.includes("--delete")) {
      await Product.deleteMany({});
      console.log("🗑️  Todos los productos eliminados");
      process.exit(0);
    }

    // Leer CSV con fs
    console.log(`📂 Leyendo CSV desde: ${CSV_PATH}`);
    const rows = parseCSV(CSV_PATH);
    console.log(`📊 ${rows.length} productos encontrados en el CSV`);

    // Transformar filas a documentos MongoDB
    const products = rows.map(row => ({
      name:        row.name,
      description: row.description,
      price:       parseFloat(row.price) || 19.99,
      category:    row.category,
      brand:       row.brand,
      temporada:   row.temporada,
      talla:       row.talla,
      color:       row.color,
      gender:      row.gender,
      stock:       parseInt(row.stock) || 50,
      rating:      parseFloat(row.rating) || 4.5,
      image_url:   row.image_url,
    }));

    // Borrar existentes e insertar nuevos
    await Product.deleteMany({});
    console.log("🗑️  Productos anteriores eliminados");

    const inserted = await Product.insertMany(products);
    console.log(`✅ ${inserted.length} productos insertados correctamente`);

    // Resumen por categoría
    const byCategory = {};
    products.forEach(p => {
      byCategory[p.category] = (byCategory[p.category] || 0) + 1;
    });
    console.log("\n📈 Resumen por categoría:");
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} productos`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error en el seed:", error.message);
    process.exit(1);
  }
};

seedDB();