<template>
  <div class="min-h-screen bg-[#F8F9FB] flex flex-col font-sans text-slate-700">
    <div class="flex flex-1 overflow-hidden">
      <main class="flex-1 overflow-y-auto p-6">
        <div class="mb-6 flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-slate-800">Sales History</h1>
            <p class="text-sm text-slate-500 mt-1">View sales analytics and filter by date</p>
          </div>
          <button
            v-if="filterType !== 'all' || customFilterApplied"
            @click="clearAllFilters"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Filters
          </button>
        </div>

        <!-- Filter Section -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Filter Type -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Filter By</label>
              <select
                v-model="filterType"
                @change="resetCustomFilter"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <!-- Date From (for custom range) -->
            <div v-if="filterType === 'custom'">
              <label class="block text-sm font-semibold text-slate-700 mb-2">From Date</label>
              <input
                type="date"
                v-model="dateFrom"
                :max="dateTo || undefined"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>

            <!-- Date To (for custom range) -->
            <div v-if="filterType === 'custom'">
              <label class="block text-sm font-semibold text-slate-700 mb-2">To Date</label>
              <input
                type="date"
                v-model="dateTo"
                :min="dateFrom || undefined"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>

            <!-- Apply Filter Button (for custom range) -->
            <div v-if="filterType === 'custom'" class="flex items-end">
              <button
                @click="applyCustomFilter"
                :disabled="!dateFrom || !dateTo"
                :class="[
                  'w-full px-6 py-2.5 rounded-lg font-semibold transition-all',
                  dateFrom && dateTo
                    ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                ]"
              >
                Apply Filter
              </button>
            </div>
          </div>
          
          <!-- Filter status info for custom range -->
          <div v-if="filterType === 'custom'" class="mt-4 text-sm">
            <p v-if="customFilterApplied && appliedDateFrom && appliedDateTo" class="text-emerald-600">
              ✓ Showing sales from <span class="font-semibold">{{ formatDate(appliedDateFrom) }}</span> to <span class="font-semibold">{{ formatDate(appliedDateTo) }}</span>
            </p>
            <p v-else-if="!dateFrom || !dateTo" class="text-slate-500">
              Select both start and end dates, then click "Apply Filter"
            </p>
            <p v-else class="text-amber-600">
              Click "Apply Filter" to see results
            </p>
          </div>
        </div>

        <!-- Sales Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <!-- Total Sales -->
          <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm p-6 text-white">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-semibold opacity-90">Total Sales</p>
              <svg class="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-3xl font-bold">{{ totalSales.toFixed(2) }} AED</p>
            <p class="text-xs opacity-75 mt-1">{{ filteredOrders.length }} orders</p>
          </div>

          <!-- Average Order Value -->
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-semibold opacity-90">Average Order</p>
              <svg class="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <p class="text-3xl font-bold">{{ averageOrderValue.toFixed(2) }} AED</p>
            <p class="text-xs opacity-75 mt-1">Per order</p>
          </div>

          <!-- Total Items Sold -->
          <div class="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-sm p-6 text-white">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-semibold opacity-90">Items Sold</p>
              <svg class="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p class="text-3xl font-bold">{{ totalItemsSold }}</p>
            <p class="text-xs opacity-75 mt-1">Total items</p>
          </div>
        </div>

        <!-- Sales Table -->
        <div v-if="filteredOrders.length === 0" class="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-100">
          <svg class="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-lg font-medium text-slate-400">No sales data for selected period</p>
        </div>

        <div v-else class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table class="w-full">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Order ID</th>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Customer</th>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Order Type</th>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Items</th>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Amount</th>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Tax</th>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Total</th>
                <th v-if="isAdmin" class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Waiter</th>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Date & Time</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-slate-50 transition">
                <td class="px-6 py-4 text-sm font-bold text-slate-700">#{{ order.id }}</td>
                <td class="px-6 py-4 text-sm text-slate-700">{{ order.customerName }}</td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-bold uppercase',
                      order.orderType === 'dine-in' ? 'bg-amber-100 text-amber-700' : 
                      order.orderType === 'takeout' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    ]"
                  >
                    {{ order.orderType === 'takeout' ? 'Take Away' : order.orderType }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-slate-600">
                  {{ getTotalItemsCount(order) }} items
                </td>
                <td class="px-6 py-4 text-sm text-slate-700">
                  {{ calculateSubtotal(order).toFixed(2) }} AED
                </td>
                <td class="px-6 py-4 text-sm text-slate-600">
                  {{ calculateTax(order).toFixed(2) }} AED
                </td>
                <td class="px-6 py-4 text-sm font-bold text-slate-800">
                  {{ calculateOrderTotal(order).toFixed(2) }} AED
                </td>
                <td v-if="isAdmin" class="px-6 py-4 text-sm text-slate-600">
                  {{ order.waiterName }}
                </td>
                <td class="px-6 py-4 text-sm text-slate-500">
                  {{ formatDateTime(order.createdAt) }}
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
import { useSalesHistory } from './salesHistoryPage.js';

const {
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
} = useSalesHistory();
</script>
