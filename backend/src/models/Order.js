const mongoose = require("mongoose");

const customizationSchema = new mongoose.Schema({
  size:   { type: String },
  name:   { type: String },
  number: { type: String },
  patch:  { type: String },
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  price:    { type: Number, required: true },
  customization: { type: customizationSchema, default: {} },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El usuario es obligatorio"],
    },
    items: [orderItemSchema],
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    address: {
      street:     { type: String, required: true },
      city:       { type: String, required: true },
      postalCode: { type: String, required: true },
      zone:       { type: String, default: "peninsula" },
      country:    { type: String, default: "España" },
    },
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "transfer"],
      default: "card",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);