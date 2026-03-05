// BillsPage logic separated from BillsPage.vue
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default function useBillsPage() {
  const router = useRouter();
  const route = useRoute();

  onMounted(() => {
    const stored = localStorage.getItem('currentUser');

    if (!stored) {
      router.push('/');
      return;
    }

    try {
      const user = JSON.parse(stored);
      const expectedRole = route.path.startsWith('/admin') ? 'admin' : 'waiter';

      if (user.role !== expectedRole) {
        if (user.role === 'admin') {
          router.push('/admin');
        } else if (user.role === 'waiter') {
          router.push('/waiter');
        } else {
          router.push('/');
        }
      }
    } catch {
      router.push('/');
    }
  });
}
