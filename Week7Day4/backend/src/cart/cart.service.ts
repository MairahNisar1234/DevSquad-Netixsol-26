import { Injectable, Logger } from '@nestjs/common';

// FIX: Added 'export' so the Controller can "see" this type
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);
  
  // Persistence: In-memory store
  private cart: { items: CartItem[]; totalPrice: number } = { items: [], totalPrice: 0 };

  getCart() {
    this.calculateTotal();
    this.logger.log(`[STORE] GET: Total items in cart: ${this.cart.items.length}`);
    return this.cart;
  }

  addItem(product: any) {
    this.logger.log(`[STORE] POST: Adding product "${product.name}" to memory`);
    const existing = this.cart.items.find(i => i.productId === product.id);

    if (existing) {
      existing.quantity += 1;
      this.logger.log(`[STORE] Incrementing quantity for ${product.name}`);
    } else {
      this.cart.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.picture?.url || '',
        quantity: 1,
      });
      this.logger.log(`[STORE] New item added to cart list`);
    }
    return this.getCart();
  }

  updateQty(productId: string, action: 'increment' | 'decrement') {
    this.logger.log(`[STORE] PATCH: Action "${action}" on ProductID: ${productId}`);
    const item = this.cart.items.find(i => i.productId === productId);
    
    if (item) {
      if (action === 'increment') item.quantity += 1;
      if (action === 'decrement' && item.quantity > 1) item.quantity -= 1;
    }
    return this.getCart();
  }

  removeItem(id: string) {
    this.logger.log(`[STORE] DELETE: Removing ProductID: ${id}`);
    this.cart.items = this.cart.items.filter(i => i.productId !== id);
    return this.getCart();
  }

  private calculateTotal() {
    this.cart.totalPrice = this.cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  }
}
