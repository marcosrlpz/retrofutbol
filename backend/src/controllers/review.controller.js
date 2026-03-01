const Review = require("../models/Review");
const Order  = require("../models/Order");

// GET /api/reviews/latest — últimas reviews para el carrusel del home
const getLatestReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name lastname")
      .populate("product", "name _id")
      .sort({ createdAt: -1 })
      .limit(9);
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reviews", error: error.message });
  }
};

// GET /api/reviews/:productId — reviews de un producto
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name lastname")
      .sort({ createdAt: -1 });
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reviews", error: error.message });
  }
};

// POST /api/reviews/:productId — crear review (solo si ha comprado el producto)
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    const hasBought = await Order.findOne({
      user: req.user._id,
      status: "delivered",
      "items.product": productId,
    });
    if (!hasBought) {
      return res.status(403).json({ message: "Solo puedes valorar productos que hayas comprado y recibido" });
    }

    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "Ya has valorado este producto" });
    }

    const review = await Review.create({ product: productId, user: req.user._id, rating, comment });
    await review.populate("user", "name lastname");
    res.status(201).json({ message: "Review creada correctamente", review });
  } catch (error) {
    res.status(500).json({ message: "Error al crear review", error: error.message });
  }
};

// DELETE /api/reviews/:id — borrar review (autor o admin)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review no encontrada" });

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "No autorizado" });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Review eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar review", error: error.message });
  }
};

module.exports = { getLatestReviews, getProductReviews, createReview, deleteReview };