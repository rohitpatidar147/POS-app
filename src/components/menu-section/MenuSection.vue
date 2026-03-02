<template>
  <section>
    <div class="flex items-center gap-4 mb-6 bg-slate-100/50 p-1 rounded-xl w-fit">
      <button
        v-for="cat in ['Appetizer', 'Main course', 'Dessert', 'Beverage']"
        :key="cat"
        type="button"
        :class="[
          'px-6 py-2 rounded-lg text-sm transition',
          cat === 'Main course' ? 'bg-white shadow-sm font-bold' : 'text-slate-400'
        ]"
      >
        {{ cat }}
      </button>
    </div>

    <MenuCards />
  </section>
</template>

<script setup lang="ts">
import MenuCards from '../menu-cards/MenuCards.vue';
</script>

