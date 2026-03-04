<template>
  <div class="min-h-screen bg-[#F8F9FB] flex flex-col font-sans text-slate-700">
    <div class="flex flex-1 overflow-hidden">
      <main class="flex-1 overflow-y-auto p-6">
        <h1 class="text-2xl font-semibold mb-2">History</h1>
        <p>This is the history page.</p>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

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
