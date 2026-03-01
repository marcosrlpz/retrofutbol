const User = require("../models/User");

// GET /api/users — todos los usuarios (admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

// PUT /api/users/:id/role — cambiar rol (admin)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role))
      return res.status(400).json({ message: "Rol no válido" });

    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ message: "No puedes cambiar tu propio rol" });

    const user = await User.findByIdAndUpdate(
      req.params.id, { role }, { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json({ message: "Rol actualizado correctamente", user });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar rol", error: error.message });
  }
};

// DELETE /api/users/:id — eliminar usuario (admin)
const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ message: "No puedes eliminarte a ti mismo" });

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
  }
};

module.exports = { getAllUsers, updateUserRole, deleteUser };