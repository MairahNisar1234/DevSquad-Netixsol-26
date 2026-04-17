import mongoose from 'mongoose';
import Product from './models/Product.js'; 
import { teaProducts } from "./data/data.js";// Adjust path to your model


const seed = async () => {
  try {
    await mongoose.connect('mongodb://mairah:m1234@ac-qmqmkfi-shard-00-00.fr9j8vv.mongodb.net:27017,ac-qmqmkfi-shard-00-01.fr9j8vv.mongodb.net:27017,ac-qmqmkfi-shard-00-02.fr9j8vv.mongodb.net:27017/tea?ssl=true&replicaSet=atlas-pzvi1x-shard-0&authSource=admin');
    await Product.deleteMany({}); // Clears old data
    await Product.insertMany(teaProducts);
    console.log("✅ Database Seeded with Products!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();