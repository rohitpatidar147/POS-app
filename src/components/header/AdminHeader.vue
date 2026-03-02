<template>
  <header class="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between">
    <div class="flex items-center gap-8">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
          <span class="font-bold">K</span>
        </div>
        <h1 class="font-bold text-xl tracking-tight">Kopag</h1>
      </div>
      <nav class="flex items-center gap-6 text-sm font-medium text-slate-500">
        <a href="#" class="text-indigo-600 border-b-2 border-indigo-600 pb-1">Dashboard</a>
        <a href="#" class="hover:text-slate-900">Order List</a>
        <a href="#" class="hover:text-slate-900">History</a>
        <a href="#" class="hover:text-slate-900">Bills</a>
      </nav>
    </div>
    <div class="flex items-center gap-4">
      <button class="p-2 text-slate-400" type="button">
        <span class="pi pi-bell" />
      </button>
      <button type="button" @click="logout" class="flex items-center gap-2">
        <img
          src="https://ui-avatars.com/api/?name=Admin"
          class="w-8 h-8 rounded-full border"
          alt="Admin avatar"
        />
        <span class="text-xs text-slate-500">Logout</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  localStorage.removeItem('currentUser');
  router.push('/');
};
</script>

