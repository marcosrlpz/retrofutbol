const jwt = require("jsonwebtoken");
const axios = require("axios");
const crypto = require("crypto");
const User = require("../models/User");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// ── Registro ──────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, lastname, email, password, city, phone } = req.body;

    if (!name || !lastname || !email || !password)
      return res.status(400).json({ message: "Faltan campos obligatorios" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "El email ya está registrado" });

    const user = await User.create({ name, lastname, email, password, city, phone });
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Usuario registrado correctamente",
      token,
      user: {
        id: user._id, name: user.name, lastname: user.lastname,
        email: user.email, role: user.role, city: user.city,
        phone: user.phone, avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("❌ ERROR en register:", error);
    res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
};

// ── Login ─────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password, recaptchaToken } = req.body;

    if (!recaptchaToken)
      return res.status(400).json({ message: "Por favor completa el captcha" });

    const captchaRes = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      { params: { secret: process.env.RECAPTCHA_SECRET, response: recaptchaToken } }
    );

    if (!captchaRes.data.success)
      return res.status(400).json({ message: "Captcha inválido. Inténtalo de nuevo." });

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({ message: "Credenciales incorrectas" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Credenciales incorrectas" });

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login correcto",
      token,
      user: {
        id: user._id, name: user.name, lastname: user.lastname,
        email: user.email, role: user.role, city: user.city,
        phone: user.phone, avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("❌ ERROR en login:", error);
    res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
};

// ── Get me ────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario", error: error.message });
  }
};

// ── Update me ─────────────────────────────────────────────────────────
const updateMe = async (req, res) => {
  try {
    const { name, lastname, city, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id, { name, lastname, city, phone }, { new: true }
    );
    res.status(200).json({ message: "Perfil actualizado", user });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar perfil", error: error.message });
  }
};

// ── Admin ─────────────────────────────────────────────────────────────
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

// ── Forgot Password ───────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Siempre respondemos OK aunque el email no exista (seguridad)
    if (!user) {
      return res.status(200).json({ message: "Si el email existe, recibirás un enlace." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hora
    await user.save();

    const { sendResetPasswordEmail } = require("../services/email.service");
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;
    await sendResetPasswordEmail({ email: user.email, name: user.name, resetUrl });

    res.status(200).json({ message: "Email de recuperación enviado" });
  } catch (error) {
    console.error("❌ Error en forgotPassword:", error.message);
    res.status(500).json({ message: "Error al procesar la solicitud" });
  }
};

// ── Reset Password ────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "El enlace no es válido o ha expirado" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("❌ Error en resetPassword:", error.message);
    res.status(500).json({ message: "Error al restablecer la contraseña" });
  }
};

module.exports = { register, login, getMe, updateMe, getAllUsers, deleteUser, forgotPassword, resetPassword };