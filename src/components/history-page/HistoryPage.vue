<template>
  <div class="min-h-screen bg-[#F8F9FB] flex flex-col font-sans text-slate-700">
    <div class="flex flex-1 overflow-hidden">
      <main class="flex-1 overflow-y-auto p-6">
        <div class="mb-6 flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-slate-800">Order History</h1>
            <p class="text-sm text-slate-500 mt-1">View completed and canceled orders</p>
          </div>
          <button
            v-if="historyOrders.length > 0 && isAdmin"
            @click="clearHistory"
            type="button"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition"
          >
            Clear History
          </button>
        </div>

        <div v-if="historyOrders.length === 0" class="text-center py-12">
          <p class="text-slate-400">No order history yet</p>
        </div>

        <div v-else class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table class="w-full">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Order ID</th>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Customer</th>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Table</th>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Items</th>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Total</th>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Status</th>
                <th v-if="isAdmin" class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Waiter</th>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="order in historyOrders" :key="order.id" class="hover:bg-slate-50 transition">
                <td class="px-6 py-4 text-sm font-bold text-slate-700">#{{ order.id }}</td>
                <td class="px-6 py-4 text-sm text-slate-700">{{ order.customerName }}</td>
                <td class="px-6 py-4 text-sm text-slate-500">{{ order.table }}</td>
                <td class="px-6 py-4 text-sm text-slate-500">
                  <div class="space-y-1">
                    <div v-for="item in order.items" :key="item.id" class="text-xs">
                      {{ item.name }} x{{ item.quantity }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-slate-700">
                  {{ calculateOrderTotal(order).toFixed(2) }} AED
                </td>
                <td class="px-6 py-4">
                  <span
                    v-if="order.status === 'completed'"
                    class="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase"
                  >
                    Completed
                  </span>
                  <span
                    v-else-if="order.status === 'canceled'"
                    class="px-3 py-1 bg-red-50 text-red-500 text-[10px] font-bold rounded-full uppercase"
                  >
                    Canceled
                  </span>
                </td>
                <td v-if="isAdmin" class="px-6 py-4 text-sm text-slate-600">
                  {{ order.waiterUsername }}
                </td>
                <td class="px-6 py-4 text-sm text-slate-500">
                  {{ formatDate(order.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHistoryPage } from './historyPage.js';

const {
  isAdmin,
  historyOrders,
  calculateOrderTotal,
  formatDate,
  clearHistory
} = useHistoryPage();
</script>
