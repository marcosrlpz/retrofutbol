const express = require("express");
const router = express.Router();
const { getWishlist, toggleWishlist } = require("../controllers/wishlist.controller");
const { protect } = require("../middlewares/auth.middleware");

router.get("/", protect, getWishlist);
router.post("/toggle", protect, toggleWishlist);

module.exports = router;