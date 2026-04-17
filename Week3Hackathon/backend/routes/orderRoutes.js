import express from 'express';
import { createOrder, updateOrderStatus, getAllOrders } from '../controllers/OrderControllers.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/all', getAllOrders);
router.patch('/:id', updateOrderStatus);

export default router;