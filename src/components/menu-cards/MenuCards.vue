<template>
  <div class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
    <article
      v-for="item in menuItems"
      :key="item.id"
      class="bg-white rounded-2xl shadow-sm border border-slate-200/70 hover:shadow-md transition-shadow flex flex-col overflow-hidden"
    >
      <div
        class="h-28 w-full bg-slate-100 flex items-center justify-center text-xs text-slate-400"
      >
        Menu image
      </div>

      <div class="p-4 flex-1 flex flex-col">
        <header class="flex items-start justify-between gap-3 mb-1.5">
          <h2 class="text-sm font-semibold text-slate-900">
            {{ item.name }}
          </h2>
          <span class="text-sm font-bold text-sky-600 shrink-0">
            ${{ item.price.toFixed(2) }}
          </span>
        </header>

        <p class="text-xs text-slate-500 leading-relaxed flex-1">
          {{ item.description }}
        </p>
      </div>

      <footer
        class="px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-3"
      >
        <div class="flex items-center gap-2 text-[11px] text-slate-400">
          <span>12 Available</span>
          <span class="h-1 w-1 rounded-full bg-slate-300"></span>
          <span>6 Sold</span>
        </div>

        <button
          type="button"
          class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-sky-500 text-white text-lg leading-none hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-1"
        >
          +
        </button>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
};

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil.',
    price: 9.99
  },
  {
    id: 2,
    name: 'Pepperoni Pizza',
    description: 'Tomato sauce, mozzarella, and spicy pepperoni slices.',
    price: 11.5
  },
  {
    id: 3,
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with parmesan, croutons, and Caesar dressing.',
    price: 7.25
  },
  {
    id: 4,
    name: 'Grilled Chicken Sandwich',
    description: 'Grilled chicken breast on a toasted bun with lettuce and tomato.',
    price: 8.75
  },
  {
    id: 5,
    name: 'French Fries',
    description: 'Golden, crispy shoestring fries with sea salt.',
    price: 3.5
  },
  {
    id: 6,
    name: 'Cheeseburger',
    description: 'Beef patty with cheddar cheese, lettuce, tomato, and pickles.',
    price: 10.0
  }
];
</script>

