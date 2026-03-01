const Order   = require("../models/Order");
const Product = require("../models/Product");
const User    = require("../models/User");
const { sendAdminOrderEmail, sendClientOrderEmail, sendClientShippedEmail, sendAdminCancelEmail, sendClientCancelEmail } = require("../services/email.service");

const SHIPPING_ZONES = {
  peninsula: { cost: 4.99,  freeFrom: 75 },
  baleares:  { cost: 7.99,  freeFrom: null },
  canarias:  { cost: 9.99,  freeFrom: null },
  ceuta:     { cost: 9.99,  freeFrom: null },
  portugal:  { cost: 6.99,  freeFrom: null },
  europa:    { cost: 12.99, freeFrom: null },
};

const getShippingCost = (zone, subtotal) => {
  const z = SHIPPING_ZONES[zone] || SHIPPING_ZONES.peninsula;
  if (z.freeFrom && subtotal >= z.freeFrom) return 0;
  return z.cost;
};

// Campo de populate completo para siempre mostrar imagen y datos
const PRODUCT_FIELDS = "name image_url price brand temporada category";

const createOrder = async (req, res) => {
  try {
    const { items, address, paymentMethod } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: "El pedido debe tener al menos un producto" });

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Producto ${item.product} no encontrado` });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Stock insuficiente para ${product.name}` });

      orderItems.push({
        product:       product._id,
        quantity:      item.quantity,
        price:         item.price || product.price,
        customization: item.customization || {},
      });
      subtotal += (item.price || product.price) * item.quantity;
      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
    }

    const shipping = getShippingCost(address?.zone, subtotal);
    const total    = Math.round((subtotal + shipping) * 100) / 100;

    const order = await Order.create({ user: req.user._id, items: orderItems, total, address, paymentMethod });
    await order.populate("items.product", PRODUCT_FIELDS);

    try {
      const user = await User.findById(req.user._id).select("name lastname email");
      await Promise.all([sendAdminOrderEmail(order, user), sendClientOrderEmail(order, user)]);
    } catch (e) { console.error("❌ Error emails:", e.message); }

    res.status(201).json({ message: "Pedido creado correctamente", order });
  } catch (error) {
    res.status(500).json({ message: "Error al crear pedido", error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", PRODUCT_FIELDS)
      .sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener pedidos", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", PRODUCT_FIELDS)
      .populate("user", "name lastname email");
    if (!order) return res.status(404).json({ message: "Pedido no encontrado" });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ message: "No autorizado" });
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener pedido", error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product", PRODUCT_FIELDS)
      .populate("user", "name lastname email")
      .sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener pedidos", error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true, runValidators: true }
    ).populate("items.product", PRODUCT_FIELDS);
    if (!order) return res.status(404).json({ message: "Pedido no encontrado" });

    if (req.body.status === "shipped") {
      try {
        const user = await User.findById(order.user).select("name lastname email");
        if (user) await sendClientShippedEmail(order, user);
      } catch (e) { console.error("❌ Error email envío:", e.message); }
    }

    res.status(200).json({ message: "Estado actualizado correctamente", order });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar pedido", error: error.message });
  }
};

const markAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Pedido no encontrado" });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "No autorizado" });
    if (order.status !== "shipped")
      return res.status(400).json({ message: "Solo puedes marcar como recibido un pedido enviado" });

    order.status = "delivered";
    await order.save();
    res.status(200).json({ message: "Pedido marcado como recibido", order });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar pedido", error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Pedido no encontrado" });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "No autorizado" });
    if (!["pending", "processing"].includes(order.status))
      return res.status(400).json({ message: "Este pedido ya no se puede cancelar" });

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }
    order.status = "cancelled";
    await order.save();

    try {
      const user = await User.findById(req.user._id).select("name lastname email");
      await Promise.all([sendAdminCancelEmail(order, user), sendClientCancelEmail(order, user)]);
    } catch (e) { console.error("❌ Error emails cancelación:", e.message); }

    res.status(200).json({ message: "Pedido cancelado correctamente", order });
  } catch (error) {
    res.status(500).json({ message: "Error al cancelar pedido", error: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, markAsDelivered, cancelOrder };