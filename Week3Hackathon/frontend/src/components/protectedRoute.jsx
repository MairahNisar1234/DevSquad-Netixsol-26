import express from 'express';
import multer from 'multer';
import Product from '../models/Product.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Files saved to 'uploads' folder

router.post("/add", upload.single('image'), async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;
    
    // req.file.path contains the file location
    const newProduct = new Product({
      name,
      category,
      image: req.file.path, // Save the path to the DB
      variants: [{ 
        name: "Standard", 
        price: parseFloat(price), 
        stock: parseInt(stock) 
      }]
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;