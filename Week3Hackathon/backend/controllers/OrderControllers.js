import Order from '../models/Orders.js';
import Product from '../models/Product.js';

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { items, total, userId } = req.body;

    const orderItems = [];

    for (const item of items) {
      // FIX: Use item._id to match what your Cart/Frontend is sending
      const productId = item._id || item.productId;
      
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${productId} not found` });
      }

      const variant = product.variants.find(v => v.name === item.variantName);
      if (!variant) {
        return res.status(400).json({ error: `Variant ${item.variantName} not found for ${product.name}` });
      }

      if (variant.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name} (${item.variantName})` });
      }

      // Push fully populated item into the array for the new Order
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: variant.price,
        quantity: item.quantity,
        variantName: variant.name
      });
    }

    const newOrder = new Order({
      user: userId,
      items: orderItems,
      total,
      status: 'Pending'
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Create Order Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// GET ALL ORDERS (ADMIN)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE ORDER STATUS (ADMIN)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // STOCK LOGIC: Deduct stock ONLY when changing status to 'Approved' 
    // and only if it hasn't been approved already (prevents double deduction).
    if (status === 'Approved' && order.status !== 'Approved') {
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { "variants.$[elem].stock": -item.quantity } },
          { arrayFilters: [{ "elem.name": item.variantName }] }
        );
      }
    }

    // Revert stock if moving from Approved back to Cancelled/Pending (Optional but good)
    if (status === 'Cancelled' && order.status === 'Approved') {
       for (const item of order.items) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { "variants.$[elem].stock": item.quantity } },
          { arrayFilters: [{ "elem.name": item.variantName }] }
        );
      }
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error("Update Order Status Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};