const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const Product = require("../models/Product");
const connectDB = require("../config/db");

const seedProducts = async () => {
  await connectDB();
  const products = [];
  const csvPath = path.join(__dirname, "data/products.csv");

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on("data", (row) => {
      products.push({
        name: row.name,
        description: row.description,
        price: parseFloat(row.price),
        category: row.category,
        brand: row.brand,
        temporada: row.temporada,
        talla: row.talla,
        color: row.color || "Varios",
        gender: row.gender || "Hombre",
        stock: parseInt(row.stock),
        rating: parseFloat(row.rating),
        image_url: row.image_url || "",
      });
    })
    .on("end", async () => {
      try {
        await Product.deleteMany();
        console.log("🗑️  Productos anteriores eliminados");
        await Product.insertMany(products);
        console.log(`✅ ${products.length} camisetas insertadas`);
        mongoose.connection.close();
      } catch (error) {
        console.error("❌ Error:", error.message);
        mongoose.connection.close();
        process.exit(1);
      }
    });
};

seedProducts();