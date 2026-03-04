<template>
  <div class="min-h-screen bg-[#F8F9FB] flex flex-col font-sans text-slate-700">
    <div class="flex flex-1 overflow-hidden">
      <main class="flex-1 overflow-y-auto p-6">
        <h1 class="text-2xl font-semibold mb-2">Bills</h1>
        <p>This is the bills page.</p>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import useBillsPage from './BillsPage.js';
useBillsPage();
</script>
