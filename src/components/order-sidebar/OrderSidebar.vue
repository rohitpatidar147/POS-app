<template>
  <aside
    class="w-96 bg-white border-l border-slate-100 p-6 flex flex-col gap-4 overflow-hidden min-h-0"
    style="height: 100vh; max-height: 100vh; scrollbar-width: none;"
  >
    <div>
      <h3 class="font-bold mb-4">Customer Information</h3>
      <input
        v-model="customerName"
        type="text"
        placeholder="Customer Name"
        class="w-full bg-slate-50 border-none rounded-xl p-3 text-sm mb-3 focus:ring-2 focus:ring-indigo-500"
      />
      <select
        v-model="orderType"
        class="w-full bg-slate-50 border-none rounded-xl p-3 text-sm mb-3 focus:ring-2 focus:ring-indigo-500"
      >
        <option value="dine-in">Dine-in</option>
        <option value="takeout">Takeout</option>
        <option value="delivery">Delivery</option>
      </select>
      <button
        type="button"
        class="w-full bg-slate-50 border-none rounded-xl p-3 text-sm text-left focus:ring-2 focus:ring-indigo-500 transition"
        :class="{ 'opacity-50 cursor-not-allowed': orderType !== 'dine-in' }"
        :disabled="orderType !== 'dine-in'"
        @click="toggleTablePicker"
      >
        {{ selectedTableLabel || 'Select Table' }}
      </button>
    </div>

    <div class="flex-1 overflow-hidden min-h-0 flex flex-col">
      <h3 class="font-bold mb-4">Order Details</h3>
      <div v-if="cart.length === 0" class="text-slate-400 text-sm">No items in cart.</div>
      <div v-else class="overflow-y-auto flex-1 pr-2">
        <div v-for="item in cart" :key="item.id" class="flex gap-3 pb-5 border-b border-[#f3722c] last:border-b-0 mb-6">
          <img
            :src="item.imageUrl || 'https://placehold.co/60x60'"
            class="w-16 h-16 rounded-xl object-cover"
            :alt="item.name"
          />
          <div class="flex-1">
            <p class="text-sm font-bold">{{ item.name }}</p>
            <div class="flex justify-between items-center mt-2">
              <div class="flex items-center gap-3 px-3 py-1.5">
                <button class="h-6 w-6 rounded-full bg-[#ffbf69] text-slate-600 hover:bg-[#f77f00] transition flex items-center justify-center font-bold text-base leading-none" type="button" @click="updateQty(item, item.quantity - 1)">−</button>
                <span class="text-sm font-bold w-6 text-center">{{ item.quantity }}</span>
                <button class="h-6 w-6 rounded-full bg-[#ffbf69] text-slate-600 hover:bg-[#f77f00] transition flex items-center justify-center font-bold text-base leading-none" type="button" @click="updateQty(item, item.quantity + 1)">+</button>
              </div>
              <p class="font-bold text-sm">{{ (item.price * item.quantity).toFixed(2) }} AED</p>
              <button class="ml-2 text-red-500 hover:text-red-700 transition" type="button" @click="removeItem(item.id)">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pt-2 border-t border-dashed border-slate-200">
      <div class="flex justify-between text-sm mb-2">
        <span class="text-slate-400">Subtotal</span>
        <span class="font-bold">{{ subtotal.toFixed(2) }} AED</span>
      </div>
      <div class="flex justify-between text-sm mb-2">
        <span class="text-slate-400">Tax (5%)</span>
        <span class="font-bold">{{ tax.toFixed(2) }} AED</span>
      </div>
      <div v-if="tableCharge > 0" class="flex justify-between text-sm mb-2">
        <span class="text-slate-400">Table Charge</span>
        <span class="font-bold">{{ tableCharge.toFixed(2) }} AED</span>
      </div>
      <div class="flex justify-between text-base font-bold mb-6 pt-2 border-t border-slate-200">
        <span>Total</span>
        <span>{{ total.toFixed(2) }} AED</span>
      </div>
      <button
        class="w-full bg-[#f3722c] text-white py-4 rounded-2xl font-bold shadow-sm shadow-[#f3722c] hover:bg-[#fcbf49] transition"
        type="button"
        :disabled="cart.length === 0"
        @click="processOrder"
      >
        Process Transaction
      </button>
      <p v-if="errorMsg" class="mt-3 text-sm text-red-600">{{ errorMsg }}</p>
    </div>
  </aside>

  <TableLayout
    :order-type="orderType"
    :show-table-picker="showTablePicker"
    @close="closeTablePicker"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Trash2 } from 'lucide-vue-next';
import { useOrderStore } from '../../stores/orderStore';
import { useTableLayoutStore } from '../../stores/tableLayoutStore';
import TableLayout from '../table-layout/TableLayout.vue';
import type { CartItem } from '../../stores/orderStore';

const orderStore = useOrderStore();
const tableLayoutStore = useTableLayoutStore();

const customerName = ref('');
const orderType = ref<'dine-in' | 'takeout' | 'delivery'>('dine-in');
const showTablePicker = ref(false);
const errorMsg = ref('');

const cart = computed(() => orderStore.cart);
const subtotal = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0));
const tax = computed(() => subtotal.value * 0.05);

const selectedTableLabel = computed(() => tableLayoutStore.selectedTable?.name ?? '');
const tableCharge = computed(() => orderType.value === 'dine-in' ? tableLayoutStore.selectedTable?.charge ?? 0 : 0);
const total = computed(() => subtotal.value + tax.value + tableCharge.value);

function updateQty(item: CartItem, qty: number) {
  orderStore.updateCartQuantity(item.id, qty);
}

function removeItem(itemId: number) {
  orderStore.removeFromCart(itemId);
}

function toggleTablePicker() {
  if (orderType.value !== 'dine-in') return;
  showTablePicker.value = !showTablePicker.value;
}

function closeTablePicker() {
  showTablePicker.value = false;
}

function processOrder() {
  if (!customerName.value.trim()) {
    errorMsg.value = 'Please enter customer name before processing.';
    return;
  }

  if (orderType.value === 'dine-in' && !selectedTableLabel.value) {
    errorMsg.value = 'Please select a table for dine-in orders.';
    return;
  }

  errorMsg.value = '';

  const stored = localStorage.getItem('currentUser');
  let waiterUsername = 'Unknown';
  let waiterName = 'Unknown';
  if (stored) {
    try {
      const user = JSON.parse(stored);
      waiterUsername = user.username || 'Unknown';
      waiterName = user.username || 'Unknown';
    } catch {
      // Keep defaults
    }
  }

  const tableValue = orderType.value === 'dine-in'
    ? selectedTableLabel.value
    : orderType.value === 'takeout'
      ? 'Takeout'
      : 'Delivery';

  const serviceCharge = orderType.value === 'dine-in' ? tableCharge.value : 0;

  orderStore.processTransaction(
    customerName.value,
    tableValue,
    waiterUsername,
    waiterName,
    orderType.value,
    serviceCharge,
  );

  customerName.value = '';
  orderType.value = 'dine-in';
  tableLayoutStore.clearSelection();
  closeTablePicker();
}

onMounted(() => {
  tableLayoutStore.initializeTables();
});
</script>

<style scoped>
aside::-webkit-scrollbar {
  display: none;
}

div::-webkit-scrollbar {
  width: 6px;
}

div::-webkit-scrollbar-track {
  background: transparent;
}

div::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

div::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

