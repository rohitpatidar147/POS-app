// SalesHistoryPage logic
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useOrderStore } from '../../stores/orderStore';

const TAX_RATE = 0.05; // 5% GST

export function useSalesHistory() {
  const router = useRouter();
  const route = useRoute();
  const orderStore = useOrderStore();

  const filterType = ref('all');
  const dateFrom = ref('');
  const dateTo = ref('');
  const customFilterApplied = ref(false);
  const appliedDateFrom = ref('');
  const appliedDateTo = ref('');

  const isAdmin = computed(() => {
    const stored = localStorage.getItem('currentUser');
    if (!stored) return false;
    try {
      const user = JSON.parse(stored);
      return user.role === 'admin';
    } catch {
      return false;
    }
  });

  // Get all completed orders
  const completedOrders = computed(() => {
    return orderStore.orders
      .filter(order => order.status === 'completed')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  // Filter orders based on selected filter type
  const filteredOrders = computed(() => {
    const now = new Date();
    const orders = completedOrders.value;

    switch (filterType.value) {
      case 'today':
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        return orders.filter(order => {
          const orderDateTime = new Date(order.createdAt).getTime();
          return orderDateTime >= todayStart.getTime() && orderDateTime <= todayEnd.getTime();
        });

      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        weekAgo.setHours(0, 0, 0, 0);
        return orders.filter(order => {
          const orderDateTime = new Date(order.createdAt).getTime();
          return orderDateTime >= weekAgo.getTime();
        });

      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        return orders.filter(order => {
          const orderDateTime = new Date(order.createdAt).getTime();
          return orderDateTime >= monthStart.getTime() && orderDateTime <= monthEnd.getTime();
        });

      case 'custom':
        if (!customFilterApplied.value || !appliedDateFrom.value || !appliedDateTo.value) {
          return orders;
        }
        const from = new Date(appliedDateFrom.value);
        from.setHours(0, 0, 0, 0);
        const to = new Date(appliedDateTo.value);
        to.setHours(23, 59, 59, 999);
        const fromTime = from.getTime();
        const toTime = to.getTime();
        return orders.filter(order => {
          const orderDateTime = new Date(order.createdAt).getTime();
          return orderDateTime >= fromTime && orderDateTime <= toTime;
        });

      case 'all':
      default:
        return orders;
    }
  });

  // Calculate total sales
  const totalSales = computed(() => {
    return filteredOrders.value.reduce((sum, order) => {
      return sum + calculateOrderTotal(order);
    }, 0);
  });

  // Calculate average order value
  const averageOrderValue = computed(() => {
    if (filteredOrders.value.length === 0) return 0;
    return totalSales.value / filteredOrders.value.length;
  });

  // Calculate total items sold
  const totalItemsSold = computed(() => {
    return filteredOrders.value.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);
  });

  // Calculate order subtotal
  const calculateSubtotal = (order) => {
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Calculate tax
  const calculateTax = (order) => {
    return calculateSubtotal(order) * TAX_RATE;
  };

  // Calculate order total
  const calculateOrderTotal = (order) => {
    const subtotal = calculateSubtotal(order);
    const tax = calculateTax(order);
    const charge = order.serviceCharge || 0;
    return subtotal + tax + charge;
  };

  // Get total items count for an order
  const getTotalItemsCount = (order) => {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateStr = date.toLocaleDateString('en-US', dateOptions);
    const timeStr = date.toLocaleTimeString('en-US', timeOptions);
    return `${dateStr} at ${timeStr}`;
  };

  // Format date only (for filter display)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Apply custom filter
  const applyCustomFilter = () => {
    if (dateFrom.value && dateTo.value) {
      appliedDateFrom.value = dateFrom.value;
      appliedDateTo.value = dateTo.value;
      customFilterApplied.value = true;
    }
  };

  // Reset custom filter when filter type changes
  const resetCustomFilter = () => {
    customFilterApplied.value = false;
    appliedDateFrom.value = '';
    appliedDateTo.value = '';
  };

  // Clear all filters and reset to "all"
  const clearAllFilters = () => {
    filterType.value = 'all';
    dateFrom.value = '';
    dateTo.value = '';
    customFilterApplied.value = false;
    appliedDateFrom.value = '';
    appliedDateTo.value = '';
  };

  onMounted(() => {
    const stored = localStorage.getItem('currentUser');

    if (!stored) {
      router.push('/');
      return;
    }

    try {
      const user = JSON.parse(stored);
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
    filterType,
    dateFrom,
    dateTo,
    customFilterApplied,
    appliedDateFrom,
    appliedDateTo,
    filteredOrders,
    totalSales,
    averageOrderValue,
    totalItemsSold,
    calculateOrderTotal,
    calculateSubtotal,
    calculateTax,
    getTotalItemsCount,
    formatDateTime,
    formatDate,
    applyCustomFilter,
    resetCustomFilter,
    clearAllFilters
  };
}
