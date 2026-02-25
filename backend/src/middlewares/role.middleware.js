const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Acceso denegado, se requiere rol de administrador" });
};

module.exports = { isAdmin };