<template>
  <div class="min-h-screen bg-[#F8F9FB] flex flex-col font-sans text-slate-700">
    <AdminHeader />

    <div class="flex flex-1 overflow-hidden">
      <main class="flex-1 overflow-y-auto p-6 space-y-8">
        <OrderList />
        <MenuSection />
      </main>

      <OrderSidebar />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AdminHeader from '../header/AdminHeader.vue';
import OrderList from '../order-list/OrderList.vue';
import MenuSection from '../menu-section/MenuSection.vue';
import OrderSidebar from '../order-sidebar/OrderSidebar.vue';

const router = useRouter();

const currentUser = ref<{ id: number; username: string; role: string } | null>(null);

onMounted(() => {
  const stored = localStorage.getItem('currentUser');

  if (!stored) {
    router.push('/');
    return;
  }

  try {
    const user = JSON.parse(stored);
    currentUser.value = user;

    if (user.role !== 'waiter') {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  } catch {
    router.push('/');
  }
});
</script>

