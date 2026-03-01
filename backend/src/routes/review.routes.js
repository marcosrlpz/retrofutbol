const express = require("express");
const router = express.Router();
const { getProductReviews, createReview, deleteReview, getLatestReviews } = require("../controllers/review.controller");
const { protect } = require("../middlewares/auth.middleware");

router.get("/latest",            getLatestReviews);   // ← debe ir ANTES de /:productId
router.get("/:productId",        getProductReviews);
router.post("/:productId",       protect, createReview);
router.delete("/:id",            protect, deleteReview);

module.exports = router;