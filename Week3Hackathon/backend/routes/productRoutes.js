import express from "express";
import Product from "../models/Product.js";
import auth from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post("/add", auth, allowRoles("admin", "superadmin"), upload.single("image"), async (req, res) => {
  try {
    const { name, category, origin, flavor, variants } = req.body;
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : ""; 

    const newProduct = new Product({
      name,
      category,
      origin,
      flavor,
      image: imagePath,
      variants: typeof variants === 'string' ? JSON.parse(variants) : variants
    });
    
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. ADMIN GET ALL (No pagination for dashboard management)
router.get("/all-admin", auth, allowRoles("admin", "superadmin"), async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); 
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { category, origin, flavor, sort, page = 1 } = req.query;
    const limit = 9; 
    const skip = (page - 1) * limit;

    let query = {};
    if (category) query.category = category;
    if (origin) query.origin = origin;
    if (flavor) query.flavor = flavor;

    let sortOptions = {};
    if (sort === "price_asc") {
      sortOptions = { "variants.0.price": 1 }; // Sorts by the price of the first variant
    } else if (sort === "price_desc") {
      sortOptions = { "variants.0.price": -1 };
    } else {
      sortOptions = { createdAt: -1 }; 
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.json({ 
      products, 
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. DELETE PRODUCT
router.delete("/:id", auth, allowRoles("admin", "superadmin"), async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete" });
    }
});

export default router;