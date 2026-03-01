const express = require("express");
const router  = express.Router();
const { getAllUsers, updateUserRole, deleteUser } = require("../controllers/user.controller");
const { protect }  = require("../middlewares/auth.middleware");
const { isAdmin }  = require("../middlewares/role.middleware");

router.get("/",              protect, isAdmin, getAllUsers);
router.put("/:id/role",      protect, isAdmin, updateUserRole);
router.delete("/:id",        protect, isAdmin, deleteUser);

module.exports = router;