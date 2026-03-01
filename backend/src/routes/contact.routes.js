const express = require("express");
const router = express.Router();
const { sendContactEmail } = require("../services/email.service");

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ message: "Faltan campos obligatorios" });

    await sendContactEmail({ name, email, subject, message });
    res.status(200).json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error("❌ Error enviando mensaje de contacto:", error.message);
    res.status(500).json({ message: "Error al enviar el mensaje" });
  }
});

module.exports = router;