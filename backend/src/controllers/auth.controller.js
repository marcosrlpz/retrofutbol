const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const register = async (req, res) => {
  try {
    const { name, lastname, email, password, city, phone } = req.body;

    // ── DEBUG: ver exactamente qué llega ──
    console.log("📩 REGISTER body:", { name, lastname, email, city, phone });

    if (!name || !lastname || !email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios: name, lastname, email, password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const user = await User.create({ name, lastname, email, password, city, phone });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Usuario registrado correctamente",
      token,
      user: {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        city: user.city,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    // ── DEBUG: ver el error completo ──
    console.error("❌ ERROR en register:", error);
    res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 LOGIN intento:", email);

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login correcto",
      token,
      user: {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        city: user.city,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("❌ ERROR en login:", error);
    res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario", error: error.message });
  }
};

const updateMe = async (req, res) => {
  try {
    const { name, lastname, city, phone } = req.body;

    // Sin runValidators para evitar disparar el pre-save hook del password
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, lastname, city, phone },
      { new: true }
    );

    res.status(200).json({ message: "Perfil actualizado", user });
  } catch (error) {
    console.error("❌ ERROR en updateMe:", error);
    res.status(500).json({ message: "Error al actualizar perfil", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
  }
};

module.exports = { register, login, getMe, updateMe, getAllUsers, deleteUser };