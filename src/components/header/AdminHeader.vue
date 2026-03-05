<template>
  <aside
    class="w-28 bg-white border-r border-slate-100 flex flex-col p-4 h-screen sticky top-0"
  >
    <!-- Logo + Brand -->
    <div class="flex flex-col items-center gap-2 mb-6">
      <img
        :src="hungryDukeLogo"
        alt="Hungry Duke logo"
        class="w-10 h-10 rounded-lg object-cover"
      />
      <h1 class="font-bold text-lg text-[#eb6424] text-center">Hungry Duke</h1>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col gap-4 flex-1">
      <RouterLink
        :to="dashboardPath"
        :class="navLinkClass(dashboardPath)"
      >
        <div class="flex flex-col items-center gap-2">
          <LayoutDashboard class="w-6 h-6" />
          <span class="text-xs text-center">Dashboard</span>
        </div>
      </RouterLink>
      <RouterLink
        :to="ordersPath"
        :class="navLinkClass(ordersPath)"
      >
        <div class="flex flex-col items-center gap-2">
          <NotepadText class="w-6 h-6" />
          <span class="text-xs text-center">Order List</span>
        </div>
      </RouterLink>
      <RouterLink
        :to="historyPath"
        :class="navLinkClass(historyPath)"
      >
        <div class="flex flex-col items-center gap-2">
          <History class="w-6 h-6" />
          <span class="text-xs text-center">History</span>
        </div>
      </RouterLink>
      <RouterLink
        :to="billsPath"
        :class="navLinkClass(billsPath)"
      >
        <div class="flex flex-col items-center gap-2">
          <Receipt class="w-6 h-6" />
          <span class="text-xs text-center">Bills</span>
        </div>
      </RouterLink>
    </nav>

    <!-- User Controls -->
    <div class="flex flex-col gap-3 pt-4 border-t border-slate-100">
      <button class="p-2 text-slate-400 hover:text-slate-600 self-center" type="button">
        <span class="pi pi-bell"/>
      </button>
      <div class="w-full">
        <UserSettingsDropdown />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import UserSettingsDropdown from '../user/settings/UserSettingsDropdown.vue';
import hungryDukeLogo from '../../assets/hungryDukeLogo.png';
import { LayoutDashboard, NotepadText, History, Receipt } from 'lucide-vue-next';
import { useAdminHeader } from './AdminHeader.js';

const {
  dashboardPath,
  ordersPath,
  historyPath,
  billsPath,
  navLinkClass
} = useAdminHeader();
</script>

