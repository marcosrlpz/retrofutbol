const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const User = require("../models/User");
const connectDB = require("../config/db");

const seedUsers = async () => {
  await connectDB();

  const users = [];

  const csvPath = path.join(__dirname, "data/users.csv");

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on("data", (row) => {
      users.push({
        name: row.name,
        lastname: row.lastname,
        email: row.email,
        password: "password123",
        role: row.role,
        city: row.city,
        phone: row.phone,
      });
    })
    .on("end", async () => {
      try {
        await User.deleteMany();
        console.log("🗑️ Usuarios anteriores eliminados");

        await User.insertMany(users);
        console.log(`✅ ${users.length} usuarios insertados correctamente`);
        console.log("👤 Admins: maria1@email.com / carlos2@email.com");
        console.log("🔑 Password para todos: password123");

        mongoose.connection.close();
      } catch (error) {
        console.error("❌ Error al insertar usuarios:", error.message);
        mongoose.connection.close();
        process.exit(1);
      }
    });
};

seedUsers();