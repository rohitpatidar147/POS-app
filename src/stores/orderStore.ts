//@ts-nocheck
import { defineStore } from 'pinia';

export type CartItem = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: number;
  items: CartItem[];
  customerName: string;
  orderType: 'dine-in' | 'takeout' | 'delivery';
  table: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'canceled';
  createdAt: string;
  waiterUsername: string;
  waiterName: string;
};

export const useOrderStore = defineStore('order', {
  state: () => ({
    cart: [] as CartItem[],
    orders: [] as Order[],
    archivedOrders: [] as Order[], // Orders deleted from dashboard but kept in history
    clearedFromHistory: [] as number[], // Order IDs cleared from history view
    nextOrderId: 1,
    hiddenFromKitchen: [] as number[], // Order IDs hidden from kitchen view
  }),
  actions: {
    addToCart(item: Omit<CartItem, 'quantity'>) {
      const found = this.cart.find((i) => i.id === item.id);
      if (found) {
        found.quantity++;
      } else {
        this.cart.push({ ...item, quantity: 1 });
      }
    },
    updateCartQuantity(itemId: number, qty: number) {
      const found = this.cart.find((i) => i.id === itemId);
      if (found && qty > 0) found.quantity = qty;
      else if (found && qty <= 0) this.removeFromCart(itemId);
    },
    removeFromCart(itemId: number) {
      this.cart = this.cart.filter((i) => i.id !== itemId);
    },
    clearCart() {
      this.cart = [];
    },
    processTransaction(customerName: string, table: string, waiterUsername: string, waiterName: string, orderType: 'dine-in' | 'takeout' | 'delivery') {
      if (!this.cart.length) return;
      this.orders.unshift({
        id: this.nextOrderId++,
        items: JSON.parse(JSON.stringify(this.cart)),
        customerName,
        orderType,
        table,
        status: 'pending',
        createdAt: new Date().toISOString(),
        waiterUsername,
        waiterName,
      });
      this.clearCart();
    },
    setOrderStatus(orderId: number, status: Order['status']) {
      const order = this.orders.find((o) => o.id === orderId);
      if (order) order.status = status;
    },
    deleteOrder(orderId: number) {
      const orderToDelete = this.orders.find((o) => o.id === orderId);
      if (orderToDelete) {
        // Move to archived orders instead of deleting
        this.archivedOrders.push(orderToDelete);
        this.orders = this.orders.filter((o) => o.id !== orderId);
      }
    },
    hideFromKitchen(orderId: number) {
      if (!this.hiddenFromKitchen.includes(orderId)) {
        this.hiddenFromKitchen.push(orderId);
      }
    },
    clearHistory() {
      // Mark all completed and canceled orders as cleared from history
      const historyOrderIds = this.orders
        .filter(o => o.status === 'completed' || o.status === 'canceled')
        .map(o => o.id);
      this.clearedFromHistory = [...this.clearedFromHistory, ...historyOrderIds];
      // Also clear archived orders completely
      this.archivedOrders = [];
    },
  },
});
