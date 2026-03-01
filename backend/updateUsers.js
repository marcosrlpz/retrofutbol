const mongoose = require("mongoose");
require("dotenv").config();

const update = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await mongoose.connection.collection("users").updateMany(
    { isVerified: { $exists: false } },
    { $set: { isVerified: true, verificationToken: null } }
  );
  console.log(`✅ Usuarios actualizados: ${result.modifiedCount}`);
  await mongoose.disconnect();
};

update().catch(console.error);