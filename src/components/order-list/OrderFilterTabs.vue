<template>
  <div v-if="showFilters" class="flex items-center gap-3 overflow-x-auto pb-1">
    <button
      v-for="filter in filters"
      :key="filter.id"
      @click="$emit('update:modelValue', filter.id)"
      type="button"
      :class="[
        'group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
        modelValue === filter.id
          ? 'bg-red-50 text-[#d62828]'
          : 'bg-[#fff8e8] text-[#efa00b] hover:bg-red-50 hover:text-[#d62828]'
      ]"
    >
      <component :is="filter.icon" class="w-4 h-4" />
      <span>{{ filter.label }}</span>
      <span 
        :class="[
          'flex items-center justify-center min-w-[24px] px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-200',
          modelValue === filter.id ? 'bg-red-100 text-[#d62828]' : 'bg-yellow-100 text-[#efa00b] group-hover:bg-red-100 group-hover:text-[#d62828]'
        ]"
      >
        {{ filter.count }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { LayoutList, UtensilsCrossed, Package, Truck } from 'lucide-vue-next';

interface Filter {
  id: 'all' | 'dine-in' | 'takeout' | 'delivery';
  label: string;
  icon: any;
  count: number;
}

interface Props {
  modelValue: 'all' | 'dine-in' | 'takeout' | 'delivery';
  allCount: number;
  dineInCount: number;
  takeoutCount: number;
  deliveryCount: number;
  showFilters?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showFilters: true,
});

defineEmits<{
  'update:modelValue': [value: 'all' | 'dine-in' | 'takeout' | 'delivery'];
}>();

const filters = computed<Filter[]>(() => [
  {
    id: 'all',
    label: 'All',
    icon: LayoutList,
    count: props.allCount,
  },
  {
    id: 'dine-in',
    label: 'Dine In',
    icon: UtensilsCrossed,
    count: props.dineInCount,
  },
  {
    id: 'takeout',
    label: 'Take Away',
    icon: Package,
    count: props.takeoutCount,
  },
  {
    id: 'delivery',
    label: 'Delivery',
    icon: Truck,
    count: props.deliveryCount,
  },
]);
</script>
