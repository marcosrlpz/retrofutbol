const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    user:    { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

// Un usuario solo puede dejar una review por producto
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Al guardar/borrar una review, recalcular el rating del producto
const recalcRating = async function (productId) {
  const Review = mongoose.model("Review");
  const result = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: "$product", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const Product = mongoose.model("Product");
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(result[0].avgRating * 10) / 10,
    });
  } else {
    await Product.findByIdAndUpdate(productId, { rating: 4.0 });
  }
};

reviewSchema.post("save",   function () { recalcRating(this.product); });
reviewSchema.post("remove", function () { recalcRating(this.product); });
reviewSchema.post("findOneAndDelete", function (doc) { if (doc) recalcRating(doc.product); });

module.exports = mongoose.model("Review", reviewSchema);