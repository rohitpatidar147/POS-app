<template>
  <AdminAuthGuard>
    <div class="flex-1 flex flex-col font-sans text-slate-700 min-h-screen bg-[#F8F9FB]">
      <div class="flex flex-1 overflow-hidden">
        <main class="flex-1 overflow-x-hidden overflow-y-auto p-6 space-y-8">
          <OrderList :allow-complete="true" :allow-cancel="true" :allow-delete="true" :show-filters="true" />
          <MenuSection />
        </main>

        <div class="flex-shrink-0">
          <OrderSidebar />
        </div>
      </div>
    </div>
  </AdminAuthGuard>
</template>

<script setup lang="ts">
import AdminAuthGuard from './auth/AdminAuthGuard.vue';
import OrderList from '../order-list/OrderList.vue';
import MenuSection from '../menu-section/MenuSection.vue';
import OrderSidebar from '../order-sidebar/OrderSidebar.vue';
</script>
