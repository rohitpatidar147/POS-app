<script setup lang="ts">
import AdminHeader from './components/header/AdminHeader.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const showAdminHeader = computed(() => route.path.startsWith('/admin') || route.path.startsWith('/waiter'));
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex">
    <AdminHeader v-if="showAdminHeader" />
    <div class="flex-1 flex flex-col">
      <router-view />
    </div>
  </div>
</template>
