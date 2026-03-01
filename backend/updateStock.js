const mongoose = require("mongoose");
require("dotenv").config();

const updateStock = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await mongoose.connection.collection("products").updateMany(
    {},
    { $set: { stock: 50 } }
  );
  console.log(`✅ Stock actualizado a 50 en ${result.modifiedCount} productos`);
  await mongoose.disconnect();
};

updateStock().catch(console.error);