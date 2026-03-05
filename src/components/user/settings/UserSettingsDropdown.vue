<template>
  <div class="relative w-full">
    <button
      type="button"
      class="flex flex-col items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-slate-50 transition"
      @click="toggleMenu"
    >
      <img
        :src="avatarSrc"
        class="w-8 h-8 rounded-full border object-cover"
        :alt="`${currentUser?.username} avatar`"
      />
      <span class="text-xs font-semibold text-slate-900 text-center truncate">{{ currentUser?.username }}</span>
    </button>

    <div
      v-if="open"
      class="absolute left-0 bottom-full mb-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-20"
    >
      <div class="px-3 py-2 border-b border-slate-100">
        <p class="text-xs text-slate-400 capitalize">Role: {{ userRole }}</p>
      </div>

      <button
        v-if="userRole === 'admin'"
        type="button"
        class="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        @click="goToAddMenuItem"
      >
        <span>Add menu item</span>
        <span class="text-xs text-slate-400">→</span>
      </button>

      <button
        v-if="userRole === 'admin'"
        type="button"
        class="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        @click="goToCreateWaiter"
      >
        <span>Waiter Accounts</span>
        <span class="text-xs text-slate-400">→</span>
      </button>

      <button
        type="button"
        class="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        @click="triggerAvatarUpload"
      >
        <span>Change profile picture</span>
      </button>

      <div v-if="userRole === 'admin'" class="my-1 border-t border-slate-100" />

      <button
        type="button"
        class="w-full flex items-center justify-between px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        @click="logout"
      >
        <span>Logout</span>
      </button>
    </div>

    <input
      id="avatar-file-input"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
import { useUserSettingsDropdown } from './userSettingsDropdown.js';

const {
  open,
  avatarSrc,
  userRole,
  currentUser,
  toggleMenu,
  goToAddMenuItem,
  goToCreateWaiter,
  triggerAvatarUpload,
  handleFileChange,
  logout
} = useUserSettingsDropdown();
</script>

