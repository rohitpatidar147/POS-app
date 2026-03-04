<template>
  <div class="min-h-screen bg-[#F8F9FB] flex flex-col font-sans text-slate-700">
    <div class="flex flex-1 overflow-hidden">
      <main class="flex-1 overflow-y-auto p-6">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-slate-800">Order List</h1>
          <p class="text-sm text-slate-500 mt-1">View and manage all orders</p>
        </div>
        <OrderList />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import OrderList from '../order-list/OrderList.vue';

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
</script>
