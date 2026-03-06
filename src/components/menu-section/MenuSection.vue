
<template>
  <section>
    <!-- Search Bar -->
    <div class="mb-4">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search menu items..."
          class="w-full bg-white border border-slate-200 rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <svg
          class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          type="button"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Categories -->
    <div class="mb-6">
      <div class="flex items-center gap-3 overflow-x-auto pb-2">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          @click="selectedCategory = cat"
          :class="[
            'inline-flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap transition',
            cat === selectedCategory 
              ? 'rounded-3xl bg-red-50 text-[#d62828] font-semibold' 
              : 'rounded-3xl bg-[#fff8e8] font-semibold text-[#efa00b] hover:bg-red-50 hover:text-[#d62828] hover:font-semibold'
          ]"
        >
          <span>{{ cat }}</span>
        </button>
      </div>
    </div>

    <p v-if="loading" class="text-sm text-slate-500">Loading menu items...</p>
    <p v-else-if="error" class="text-sm text-red-600">{{ error }}</p>
    <MenuCards v-else :menu-items="itemsInCategory" :is-admin="isAdmin" />
  </section>
</template>

<script setup lang="ts">
import MenuCards from '../menu-cards/MenuCards.vue';
import { useMenuSection } from './menuSection.js';

const {
  menuItems,
  selectedCategory,
  searchQuery,
  loading,
  error,
  isAdmin,
  categories,
  itemsInCategory
} = useMenuSection();
</script>

