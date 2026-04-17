import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', 
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer()
  server!: Server; 

  handleConnection(client: Socket) {
    console.log(`✅ Client connected: ${client.id}`);
    
    const userId = client.handshake.query.userId;
    if (userId) {
      client.join(`user_${userId}`);
      console.log(`👤 User ${userId} joined their private room.`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }


  sendAdminOrderAlert(orderData: any) {
    if (!this.server) return;

    const total = 
      orderData?.summary?.totalAmount || 
      orderData?.totalAmount || 
      orderData?.total || 
      0;

    const payload = {
      title: '📦 New Order Received!',
      message: `${orderData?.name || 'Customer'} just placed an order for ₹${total}`,
      orderId: orderData?._id,
      time: new Date().toLocaleTimeString(),
    };

    this.server.emit('admin-new-order', payload);
    console.log(`📢 Admin Alert sent for Order: ${orderData?._id} for ₹${total}`);
  }

  // --- 2. USER NOTIFICATION: New Product Added ---
  broadcastNewProduct(productName: string, category: string) {
    if (!this.server) return;

    const payload = {
      title: '✨ New Arrival!',
      message: `A fresh new ${productName} just landed in ${category}. Check it out!`,
      type: 'new_product',
      time: new Date().toLocaleTimeString(),
    };

    this.server.emit('user-notification', payload);
    console.log(`📢 New Product Broadcast: ${productName}`);
  }

  // --- 3. USER NOTIFICATION: Order Confirmation ---
  sendUserOrderConfirmation(userId: string, orderId: string) {
    if (!this.server) return;

    // FIX: Added safety check for orderId slice
    const payload = {
      title: 'Order Confirmed!',
      message: `Your order #${orderId?.slice(-6) || 'N/A'} has been placed successfully.`,
      time: new Date().toLocaleTimeString(),
    };

    this.server.to(`user_${userId}`).emit('order-placed-success', payload);
  }

  // --- Flash Sale Notifications ---
  sendSaleNotification(productName: string, discount: number) {
    if (!this.server) return;

    const payload = {
      message: `🔥 Flash Sale: ${productName} is now ${discount}% OFF!`,
      time: new Date().toLocaleTimeString(),
    };

    this.server.emit('sale-notification', payload);
  }

  // --- Points Notifications ---
  sendPointsNotification(points: number, totalPoints: number) {
    if (!this.server) return;

    this.server.emit('points-updated', {
      message: `🌟 You earned ${points} loyalty points!`,
      currentBalance: totalPoints,
    });
  }

  // --- NEW: REAL-TIME PRODUCT SYNC METHODS ---

  @SubscribeMessage('updateProduct')
  handleProductUpdate(
    @MessageBody() updatedProduct: any, 
    @ConnectedSocket() client: Socket
  ) {
    console.log(`🔄 Syncing Product: ${updatedProduct?.name}`);
    client.broadcast.emit('productUpdated', updatedProduct);
  }

  @SubscribeMessage('deleteProduct')
  handleProductDelete(
    @MessageBody() productId: string,
    @ConnectedSocket() client: Socket
  ) {
    console.log(`🗑️ Product Deleted Sync: ${productId}`);
    client.broadcast.emit('productDeleted', productId);
  }
}