// Logic for AdminHeader component
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export function useAdminHeader() {
  const route = useRoute();

  const userRole = computed(() => {
    if (route.path.startsWith('/waiter')) return 'waiter';
    if (route.path.startsWith('/admin')) return 'admin';
    return 'admin'; // default
  });

  const dashboardPath = computed(() => userRole.value === 'waiter' ? '/waiter' : '/admin');
  const ordersPath = computed(() => `/${userRole.value}/orders`);
  const historyPath = computed(() => `/${userRole.value}/history`);
  const billsPath = computed(() => `/${userRole.value}/bills`);

  const navLinkClass = (path) =>
    route.path === path
      ? "w-full rounded-lg relative transition-colors duration-300 text-[#d62828] bg-red-50 font-semibold p-3 flex justify-center"
      : "w-full rounded-lg relative transition-colors duration-300 text-[#f77f00] hover:text-[#d62828] hover:bg-slate-50 p-3 flex justify-center";

  return {
    route,
    userRole,
    dashboardPath,
    ordersPath,
    historyPath,
    billsPath,
    navLinkClass
  };
}
