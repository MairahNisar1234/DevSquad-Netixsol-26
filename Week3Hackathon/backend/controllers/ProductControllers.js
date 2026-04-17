import Product from '../models/Product.js';
import Order from '../models/Orders.js';

export const getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 9, 
      category, 
      minPrice, 
      maxPrice, 
      sort,
      flavor,
      origin 
    } = req.query;

    // 1. FILTERS (Requirement 2.3)
    let query = {};
    if (category) query.category = category;
    if (flavor) query.flavor = flavor;
    if (origin) query.origin = origin;
    
    // Price Range Filter on Variants
    if (minPrice || maxPrice) {
      query["variants.price"] = {};
      if (minPrice) query["variants.price"].$gte = Number(minPrice);
      if (maxPrice) query["variants.price"].$lte = Number(maxPrice);
    }

    // 2. SORTING (Requirement 2.6)
    let sortOptions = {};
    if (sort === 'priceAsc') sortOptions = { 'variants.price': 1 };
    else if (sort === 'priceDesc') sortOptions = { 'variants.price': -1 };

    // 3. PAGINATION (Requirement 2.4 & 2.5 - No client-side pagination)
    const skip = (page - 1) * limit;
    
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const totalProducts = await Product.countDocuments(query);

    // 4. RETURN PAGINATED DATA (Requirement 2.8)
    res.json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: Number(page),
      totalProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getInventoryStats = async (req, res) => {
  try {
    const products = await Product.find();
    
    // Summing up stock across all variants for all products
    const totalStock = products.reduce((total, p) => {
      const variantStock = p.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
      return total + variantStock;
    }, 0);

    res.json({ totalStock });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const products = await Product.find();
    
    // Calculate total revenue and total stock
    const revenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]);
    const totalStock = products.reduce((acc, p) => acc + p.variants.reduce((s, v) => s + v.stock, 0), 0);

    res.json({
      totalOrders,
      revenue: revenue[0]?.total || 0,
      totalStock
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};