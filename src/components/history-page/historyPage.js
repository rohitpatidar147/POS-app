import { onMounted, computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useOrderStore } from '../../stores/orderStore';

export const useHistoryPage = () => {
  const router = useRouter();
  const route = useRoute();
  const orderStore = useOrderStore();
  const isAdmin = ref(false);
  const currentUsername = ref('');
  const TAX_RATE = 0.05; // 5% GST

  const historyOrders = computed(() => {
    // Combine orders and archived orders for history display
    const allOrders = [
      ...orderStore.orders.filter(order => 
        (order.status === 'completed' || order.status === 'canceled') &&
        !orderStore.clearedFromHistory.includes(order.id)
      ),
      ...orderStore.archivedOrders.filter(order => 
        !orderStore.clearedFromHistory.includes(order.id)
      )
    ];
    
    // Filter by waiter if not admin
    const filteredOrders = isAdmin.value 
      ? allOrders 
      : allOrders.filter(order => order.waiterUsername === currentUsername.value);
    
    return filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  const calculateSubtotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getOrderCharge = (order) => {
    return Math.max(0, Number(order.serviceCharge || 0));
  };

  const calculateOrderTotal = (order) => {
    const subtotal = calculateSubtotal(order.items);
    const tax = subtotal * TAX_RATE;
    return subtotal + tax + getOrderCharge(order);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all order history? This action cannot be undone.')) {
      orderStore.clearHistory();
    }
  };

  onMounted(() => {
    const stored = localStorage.getItem('currentUser');

    if (!stored) {
      router.push('/');
      return;
    }

    try {
      const user = JSON.parse(stored);
      
      // Check if user is admin and store username
      isAdmin.value = user.role === 'admin';
      currentUsername.value = user.username || '';
      const expectedRole = route.path.startsWith('/admin') ? 'admin' : 'waiter';

      if (user.role !== expectedRole) {
        if (user.role === 'admin') {
          router.push('/admin');
        } else if (user.role === 'waiter') {
          router.push('/waiter');
        } else {
          router.push('/');
        }
      }
    } catch {
      router.push('/');
    }
  });

  return {
    isAdmin,
    currentUsername,
    historyOrders,
    calculateOrderTotal,
    formatDate,
    clearHistory
  };
};
