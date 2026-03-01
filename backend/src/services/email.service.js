const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Email al admin cuando llega un pedido ─────────────────────────────
const sendAdminOrderEmail = async (order, user) => {
  const itemsHtml = order.items
    .map((item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${item.product?.name || "Producto"}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">${item.price?.toFixed(2)} €</td>
      </tr>`)
    .join("");

  await transporter.sendMail({
    from: `"RetroFútbol" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🛒 Nuevo pedido #${order._id.toString().slice(-8).toUpperCase()} — ${order.total?.toFixed(2)} €`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1a2e1a;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
          <h1 style="color:#c9a84c;margin:0;font-size:24px;">⚽ RetroFútbol</h1>
          <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;">Nuevo pedido recibido</p>
        </div>
        <div style="background:#f9f7f2;padding:24px;border:1px solid #e5e7eb;">
          <h2 style="color:#111827;font-size:18px;">Pedido #${order._id.toString().slice(-8).toUpperCase()}</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
            <thead>
              <tr style="background:#e5e7eb;">
                <th style="padding:8px;text-align:left;font-size:12px;text-transform:uppercase;">Producto</th>
                <th style="padding:8px;text-align:center;font-size:12px;text-transform:uppercase;">Cantidad</th>
                <th style="padding:8px;text-align:right;font-size:12px;text-transform:uppercase;">Precio</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="text-align:right;font-size:18px;font-weight:bold;color:#111827;margin-bottom:24px;">
            Total: ${order.total?.toFixed(2)} €
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div style="background:white;padding:16px;border-radius:8px;border:1px solid #e5e7eb;">
              <p style="font-size:11px;text-transform:uppercase;color:#6b7280;font-weight:700;margin:0 0 8px;">Cliente</p>
              <p style="margin:0;font-weight:600;">${user.name} ${user.lastname}</p>
              <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">${user.email}</p>
            </div>
            <div style="background:white;padding:16px;border-radius:8px;border:1px solid #e5e7eb;">
              <p style="font-size:11px;text-transform:uppercase;color:#6b7280;font-weight:700;margin:0 0 8px;">Dirección de envío</p>
              <p style="margin:0;font-size:14px;">${order.address?.street}</p>
              <p style="margin:4px 0 0;font-size:14px;">${order.address?.postalCode} ${order.address?.city}</p>
            </div>
          </div>
          <div style="margin-top:16px;background:white;padding:16px;border-radius:8px;border:1px solid #e5e7eb;">
            <p style="font-size:11px;text-transform:uppercase;color:#6b7280;font-weight:700;margin:0 0 4px;">Método de pago</p>
            <p style="margin:0;font-size:14px;">${
              { card: "💳 Tarjeta", paypal: "🅿️ PayPal", transfer: "🏦 Transferencia bancaria" }[order.paymentMethod] || order.paymentMethod
            }</p>
          </div>
        </div>
        <div style="background:#1a2e1a;padding:16px;text-align:center;border-radius:0 0 8px 8px;">
          <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0;">RetroFútbol · Calle Real, 15 · Puerto Real, Cádiz</p>
        </div>
      </div>
    `,
  });
};

// ── Email de confirmación al cliente ──────────────────────────────────
const sendClientOrderEmail = async (order, user) => {
  const itemsHtml = order.items
    .map((item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${item.product?.name || "Producto"}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">${item.price?.toFixed(2)} €</td>
      </tr>`)
    .join("");

  await transporter.sendMail({
    from: `"RetroFútbol" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `✅ Pedido confirmado #${order._id.toString().slice(-8).toUpperCase()} — ¡Gracias por tu compra!`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1a2e1a;padding:32px;text-align:center;border-radius:8px 8px 0 0;">
          <h1 style="color:#c9a84c;margin:0;font-size:28px;">⚽ RetroFútbol</h1>
          <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:16px;">¡Pedido confirmado!</p>
        </div>
        <div style="background:#f9f7f2;padding:32px;border:1px solid #e5e7eb;">
          <p style="font-size:16px;color:#111827;">Hola <strong>${user.name}</strong>,</p>
          <p style="color:#6b7280;line-height:1.6;">Hemos recibido tu pedido correctamente. Lo procesaremos lo antes posible y recibirás un email cuando sea enviado.</p>
          <div style="background:#c9a84c;color:white;padding:16px;border-radius:8px;text-align:center;margin:24px 0;">
            <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;opacity:0.8;">Número de pedido</p>
            <p style="margin:4px 0 0;font-size:24px;font-weight:800;">#${order._id.toString().slice(-8).toUpperCase()}</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
            <thead>
              <tr style="background:#e5e7eb;">
                <th style="padding:8px;text-align:left;font-size:12px;text-transform:uppercase;">Producto</th>
                <th style="padding:8px;text-align:center;font-size:12px;text-transform:uppercase;">Cantidad</th>
                <th style="padding:8px;text-align:right;font-size:12px;text-transform:uppercase;">Precio</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="text-align:right;font-size:18px;font-weight:bold;color:#111827;margin-bottom:24px;">
            Total: ${order.total?.toFixed(2)} €
          </div>
          <div style="background:white;padding:16px;border-radius:8px;border:1px solid #e5e7eb;">
            <p style="font-size:11px;text-transform:uppercase;color:#6b7280;font-weight:700;margin:0 0 8px;">Dirección de envío</p>
            <p style="margin:0;font-size:14px;">${order.address?.street}</p>
            <p style="margin:4px 0 0;font-size:14px;">${order.address?.postalCode} ${order.address?.city}</p>
          </div>
          <div style="margin-top:24px;padding:16px;background:#f0ebe0;border-radius:8px;border-left:4px solid #c9a84c;">
            <p style="margin:0;font-size:13px;color:#6b7280;">
              📦 <strong>Plazo de entrega:</strong> 7-15 días laborables en España peninsular.<br/>
              ¿Dudas? Escríbenos a <a href="mailto:inf.retrofutbol@gmail.com" style="color:#c9a84c;">inf.retrofutbol@gmail.com</a>
            </p>
          </div>
        </div>
        <div style="background:#1a2e1a;padding:16px;text-align:center;border-radius:0 0 8px 8px;">
          <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0;">RetroFútbol · Calle Real, 15 · Puerto Real, Cádiz · inf.retrofutbol@gmail.com</p>
        </div>
      </div>
    `,
  });
};

// ── Email al cliente cuando el pedido es enviado 🚚 ───────────────────
const sendClientShippedEmail = async (order, user) => {
  await transporter.sendMail({
    from: `"RetroFútbol" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `🚚 Tu pedido #${order._id.toString().slice(-8).toUpperCase()} está en camino`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1a2e1a;padding:32px;text-align:center;border-radius:8px 8px 0 0;">
          <h1 style="color:#c9a84c;margin:0;font-size:28px;">⚽ RetroFútbol</h1>
          <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:16px;">¡Tu pedido está en camino!</p>
        </div>
        <div style="background:#f9f7f2;padding:32px;border:1px solid #e5e7eb;">
          <p style="font-size:16px;color:#111827;">Hola <strong>${user.name}</strong>,</p>
          <p style="color:#6b7280;line-height:1.6;">
            ¡Buenas noticias! Tu pedido acaba de ser enviado y está en camino hacia ti.
          </p>
          <div style="background:#1a2e1a;color:white;padding:24px;border-radius:8px;text-align:center;margin:24px 0;">
            <p style="margin:0;font-size:40px;">🚚</p>
            <p style="margin:8px 0 0;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;opacity:0.7;">Pedido enviado</p>
            <p style="margin:4px 0 0;font-size:24px;font-weight:800;color:#c9a84c;">
              #${order._id.toString().slice(-8).toUpperCase()}
            </p>
          </div>
          <div style="background:white;padding:16px;border-radius:8px;border:1px solid #e5e7eb;margin-bottom:16px;">
            <p style="font-size:11px;text-transform:uppercase;color:#6b7280;font-weight:700;margin:0 0 8px;">Dirección de entrega</p>
            <p style="margin:0;font-size:14px;font-weight:600;">${order.address?.street}</p>
            <p style="margin:4px 0 0;font-size:14px;color:#6b7280;">${order.address?.postalCode} ${order.address?.city}</p>
          </div>
          <div style="padding:16px;background:#f0ebe0;border-radius:8px;border-left:4px solid #c9a84c;">
            <p style="margin:0;font-size:13px;color:#6b7280;">
              📦 <strong>Plazo de entrega:</strong> 7-15 días laborables.<br/>
              Cuando recibas el pedido, márcalo como recibido en tu perfil.<br/>
              ¿Dudas? <a href="mailto:inf.retrofutbol@gmail.com" style="color:#c9a84c;">inf.retrofutbol@gmail.com</a>
            </p>
          </div>
        </div>
        <div style="background:#1a2e1a;padding:16px;text-align:center;border-radius:0 0 8px 8px;">
          <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0;">RetroFútbol · Calle Real, 15 · Puerto Real, Cádiz · inf.retrofutbol@gmail.com</p>
        </div>
      </div>
    `,
  });
};

// ── Email al admin cuando se cancela un pedido ───────────────────────
const sendAdminCancelEmail = async (order, user) => {
  await transporter.sendMail({
    from: `"RetroFútbol" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `❌ Pedido cancelado #${order._id.toString().slice(-8).toUpperCase()} — ${user.name} ${user.lastname}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1a2e1a;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
          <h1 style="color:#c9a84c;margin:0;font-size:24px;">⚽ RetroFútbol</h1>
          <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;">Pedido cancelado</p>
        </div>
        <div style="background:#fef2f2;padding:24px;border:1px solid #fee2e2;">
          <h2 style="color:#991b1b;">❌ Pedido #${order._id.toString().slice(-8).toUpperCase()} cancelado</h2>
          <p style="color:#6b7280;font-size:14px;">El cliente <strong>${user.name} ${user.lastname}</strong> (${user.email}) ha cancelado su pedido.</p>
          <p style="color:#6b7280;font-size:14px;">El stock de los productos ha sido repuesto automáticamente.</p>
          <div style="background:white;padding:16px;border-radius:8px;border:1px solid #fee2e2;margin-top:16px;">
            <p style="font-size:11px;text-transform:uppercase;color:#6b7280;font-weight:700;margin:0 0 8px;">Total cancelado</p>
            <p style="font-size:24px;font-weight:800;color:#991b1b;margin:0;">${order.total?.toFixed(2)} €</p>
          </div>
        </div>
        <div style="background:#1a2e1a;padding:16px;text-align:center;border-radius:0 0 8px 8px;">
          <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0;">RetroFútbol · Calle Real, 15 · Puerto Real, Cádiz</p>
        </div>
      </div>
    `,
  });
};

// ── Email de confirmación de cancelación al cliente ───────────────────
const sendClientCancelEmail = async (order, user) => {
  await transporter.sendMail({
    from: `"RetroFútbol" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `❌ Pedido cancelado #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1a2e1a;padding:32px;text-align:center;border-radius:8px 8px 0 0;">
          <h1 style="color:#c9a84c;margin:0;font-size:28px;">⚽ RetroFútbol</h1>
          <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:16px;">Pedido cancelado</p>
        </div>
        <div style="background:#f9f7f2;padding:32px;border:1px solid #e5e7eb;">
          <p style="font-size:16px;color:#111827;">Hola <strong>${user.name}</strong>,</p>
          <p style="color:#6b7280;line-height:1.6;">Tu pedido ha sido cancelado correctamente. Si tienes alguna duda, no dudes en contactarnos.</p>
          <div style="background:#fee2e2;padding:16px;border-radius:8px;text-align:center;margin:24px 0;">
            <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#991b1b;font-weight:700;">Pedido cancelado</p>
            <p style="margin:4px 0 0;font-size:24px;font-weight:800;color:#991b1b;">#${order._id.toString().slice(-8).toUpperCase()}</p>
          </div>
          <div style="margin-top:16px;padding:16px;background:#f0ebe0;border-radius:8px;border-left:4px solid #c9a84c;">
            <p style="margin:0;font-size:13px;color:#6b7280;">
              ¿Fue un error? Puedes hacer un nuevo pedido en cualquier momento.<br/>
              Escríbenos a <a href="mailto:inf.retrofutbol@gmail.com" style="color:#c9a84c;">inf.retrofutbol@gmail.com</a>
            </p>
          </div>
        </div>
        <div style="background:#1a2e1a;padding:16px;text-align:center;border-radius:0 0 8px 8px;">
          <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0;">RetroFútbol · Calle Real, 15 · Puerto Real, Cádiz · inf.retrofutbol@gmail.com</p>
        </div>
      </div>
    `,
  });
};

// ── Email de verificación de cuenta ──────────────────────────────────
const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  await transporter.sendMail({
    from: `"RetroFútbol" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "✅ Verifica tu cuenta de RetroFútbol",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1a2e1a;padding:32px;text-align:center;border-radius:8px 8px 0 0;">
          <h1 style="color:#c9a84c;margin:0;font-size:28px;">⚽ RetroFútbol</h1>
          <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:16px;">Verifica tu cuenta</p>
        </div>
        <div style="background:#f9f7f2;padding:32px;border:1px solid #e5e7eb;">
          <p style="font-size:16px;color:#111827;">Hola <strong>${user.name}</strong>,</p>
          <p style="color:#6b7280;line-height:1.6;">Gracias por registrarte en RetroFútbol. Para activar tu cuenta, confirma tu email:</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${verifyUrl}" style="background:#1a2e1a;color:white;font-size:1rem;font-weight:700;padding:1rem 2rem;border-radius:8px;text-decoration:none;display:inline-block;">✅ Verificar mi cuenta</a>
          </div>
          <p style="color:#9ca3af;font-size:12px;text-align:center;">Este enlace expira en 24 horas.</p>
        </div>
        <div style="background:#1a2e1a;padding:16px;text-align:center;border-radius:0 0 8px 8px;">
          <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0;">RetroFútbol · Calle Real, 15 · Puerto Real, Cádiz</p>
        </div>
      </div>
    `,
  });
};

// ── Email de contacto ─────────────────────────────────────────────────
const sendContactEmail = async ({ name, email, subject, message }) => {
  await transporter.sendMail({
    from: `"RetroFútbol" <${process.env.EMAIL_USER}>`,
    to: "inf.retrofutbol@gmail.com",
    replyTo: email,
    subject: `📩 Contacto: ${subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1a2e1a;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
          <h1 style="color:#c9a84c;margin:0;font-size:24px;">⚽ RetroFútbol</h1>
          <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;">Nuevo mensaje de contacto</p>
        </div>
        <div style="background:#f9f7f2;padding:24px;border:1px solid #e5e7eb;">
          <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
            <tr><td style="padding:8px;font-weight:700;font-size:13px;color:#6b7280;width:100px;">Nombre:</td><td style="padding:8px;font-size:14px;">${name}</td></tr>
            <tr style="background:#f0ebe0;"><td style="padding:8px;font-weight:700;font-size:13px;color:#6b7280;">Email:</td><td style="padding:8px;font-size:14px;"><a href="mailto:${email}" style="color:#c9a84c;">${email}</a></td></tr>
            <tr><td style="padding:8px;font-weight:700;font-size:13px;color:#6b7280;">Asunto:</td><td style="padding:8px;font-size:14px;">${subject}</td></tr>
          </table>
          <div style="background:white;padding:16px;border-radius:8px;border:1px solid #e5e7eb;">
            <p style="font-size:11px;text-transform:uppercase;color:#6b7280;font-weight:700;margin:0 0 8px;">Mensaje:</p>
            <p style="font-size:14px;line-height:1.6;color:#111827;margin:0;">${message.replace(/\n/g, "<br>")}</p>
          </div>
          <p style="margin-top:16px;font-size:12px;color:#9ca3af;">Responde directamente a este email para contactar con ${name}.</p>
        </div>
        <div style="background:#1a2e1a;padding:16px;text-align:center;border-radius:0 0 8px 8px;">
          <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0;">RetroFútbol · Calle Real, 15 · Puerto Real, Cádiz</p>
        </div>
      </div>
    `,
  });
};

// ── Email de recuperación de contraseña ──────────────────────────────
const sendResetPasswordEmail = async ({ email, name, resetUrl }) => {
  await transporter.sendMail({
    from: `"RetroFútbol" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔑 Recupera tu contraseña - RetroFútbol",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1a2e1a;padding:32px;text-align:center;border-radius:8px 8px 0 0;">
          <h1 style="color:#c9a84c;margin:0;font-size:28px;">⚽ RetroFútbol</h1>
          <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:16px;">Recupera tu contraseña</p>
        </div>
        <div style="background:#f9f7f2;padding:32px;border:1px solid #e5e7eb;">
          <p style="font-size:16px;color:#111827;">Hola <strong>${name}</strong>,</p>
          <p style="color:#6b7280;line-height:1.6;">
            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en RetroFútbol.
          </p>
          <p style="color:#6b7280;line-height:1.6;">
            Haz clic en el botón de abajo para crear una nueva contraseña. Este enlace es válido durante <strong>1 hora</strong>.
          </p>
          <div style="text-align:center;margin:35px 0;">
            <a href="${resetUrl}" style="background:#1a2e1a;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
              🔑 Restablecer contraseña
            </a>
          </div>
          <p style="color:#888;font-size:13px;line-height:1.6;">
            Si no has solicitado este cambio, puedes ignorar este email. Tu contraseña no cambiará.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:25px 0;" />
          <p style="color:#bbb;font-size:12px;">
            Si el botón no funciona, copia y pega este enlace en tu navegador:<br/>
            <a href="${resetUrl}" style="color:#c9a84c;word-break:break-all;">${resetUrl}</a>
          </p>
        </div>
        <div style="background:#1a2e1a;padding:16px;text-align:center;border-radius:0 0 8px 8px;">
          <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0;">RetroFútbol · Calle Real, 15 · Puerto Real, Cádiz · inf.retrofutbol@gmail.com</p>
        </div>
      </div>
    `,
  });
};

module.exports = {
  sendAdminOrderEmail,
  sendClientOrderEmail,
  sendClientShippedEmail,
  sendAdminCancelEmail,
  sendClientCancelEmail,
  sendVerificationEmail,
  sendContactEmail,
  sendResetPasswordEmail,
};