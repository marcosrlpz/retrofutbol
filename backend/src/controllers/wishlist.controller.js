const User = require("../models/User");

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist", "name image_url price brand category temporada");
    res.status(200).json({ wishlist: user.wishlist || [] });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener wishlist", error: error.message });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    const index = user.wishlist.indexOf(productId);

    if (index === -1) {
      user.wishlist.push(productId);
    } else {
      user.wishlist.splice(index, 1);
    }

    await user.save();
    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar wishlist", error: error.message });
  }
};

module.exports = { getWishlist, toggleWishlist };