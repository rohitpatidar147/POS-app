import { computed } from 'vue';
import { LayoutList, UtensilsCrossed, Package, Truck } from 'lucide-vue-next';

export const useOrderFilterTabs = (props) => {
  const filters = computed(() => [
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

  return {
    filters
  };
};
