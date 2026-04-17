import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  image: String,
  flavor: String,
  origin: String,
  qualities: [String], // Array: ["Detox", "Energy"]
  caffeine: { type: String, enum: ["None", "Low", "Medium", "High"] },
  allergens: [String], // Array: ["Lactose-free", "Gluten-free"]
  isOrganic: { type: Boolean, default: false },
  variants: [{ 
    name: String, 
    price: Number, 
    stock: Number 
  }]
});

export default mongoose.model("Product", productSchema);