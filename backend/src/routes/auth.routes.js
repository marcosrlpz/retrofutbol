const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateMe,
  getAllUsers,
  deleteUser,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.get("/users", protect, isAdmin, getAllUsers);
router.delete("/users/:id", protect, isAdmin, deleteUser);

module.exports = router;