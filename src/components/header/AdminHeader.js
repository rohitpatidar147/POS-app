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
      ? "inline-flex items-center gap-2 pb-1 relative transition-colors duration-300 text-[#eb8f34] after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#eb8f34] after:origin-left after:scale-x-100 after:transition-transform after:duration-500"
      : "inline-flex items-center gap-2 pb-1 relative transition-colors duration-300 text-slate-500 hover:text-[#eb8f34] after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#eb8f34] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-500";

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
