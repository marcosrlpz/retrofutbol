const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: [true, "El nombre es obligatorio"], trim: true },
    lastname: { type: String, required: [true, "El apellido es obligatorio"], trim: true },
    email:    { type: String, required: [true, "El email es obligatorio"], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, "La contraseña es obligatoria"], minlength: 6, select: false },
    role:     { type: String, enum: ["user", "admin"], default: "user" },
    city:     { type: String, trim: true },
    phone:    { type: String, trim: true },
    avatar:   { type: String, default: "" },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    isVerified:             { type: Boolean, default: false },
    verificationToken:      { type: String, default: null },
    resetPasswordToken:     { type: String, default: undefined },
    resetPasswordExpires:   { type: Date,   default: undefined },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);