<template>
  <AdminAuthGuard>
    <div class="min-h-screen bg-[#F8F9FB] flex flex-col font-sans text-slate-700">
      <main class="flex-1 flex justify-center items-start p-6">
        <div class="w-full max-w-2xl">
          <section class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 class="text-lg font-semibold mb-1 text-slate-900">Waiter Accounts</h2>
            <p class="text-xs text-slate-500 mb-5">
              Create new waiter accounts or manage existing ones.
            </p>

            <!-- Create New Waiter Form -->
            <div class="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 class="text-sm font-semibold mb-3 text-slate-900">Create New Waiter</h3>
              <form @submit.prevent="createWaiter" class="space-y-3">
                <div>
                  <label for="new-username" class="block text-xs font-medium mb-1">
                    Username
                  </label>
                  <input
                    id="new-username"
                    v-model="newUsername"
                    type="text"
                    class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Waiter username"
                  />
                </div>

                <div>
                  <label for="new-password" class="block text-xs font-medium mb-1">
                    Password
                  </label>
                  <input
                    id="new-password"
                    v-model="newPassword"
                    type="password"
                    class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Waiter password"
                  />
                </div>

                <button
                  type="submit"
                  :disabled="submitting"
                  class="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-semibold py-2 rounded-lg transition text-sm"
                >
                  {{ submitting ? 'Creating...' : 'Create Waiter' }}
                </button>
              </form>
            </div>

            <!-- Message -->
            <p
              v-if="message"
              :class="[
                'mb-4 text-sm',
                messageType === 'error' ? 'text-red-600' : 'text-emerald-600'
              ]"
            >
              {{ message }}
            </p>

            <!-- Existing Waiters List -->
            <div>
              <h3 class="text-sm font-semibold mb-3 text-slate-900">Existing Waiter Accounts</h3>
              
              <div v-if="loading" class="text-sm text-slate-500">
                Loading waiter accounts...
              </div>

              <div v-else-if="waiters.length === 0" class="text-sm text-slate-500">
                No waiter accounts created yet. Create one to get started!
              </div>

              <div v-else class="space-y-2">
                <div
                  v-for="waiter in waiters"
                  :key="waiter.id"
                  class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <div>
                    <p class="text-sm font-medium text-slate-900">{{ waiter.username }}</p>
                    <p class="text-xs text-slate-500">ID: {{ waiter.id }}</p>
                  </div>

                  <button
                    type="button"
                    @click="deleteWaiter(waiter.id, waiter.username)"
                    :disabled="submitting"
                    class="px-3 py-1 bg-red-500 hover:bg-red-600 disabled:bg-slate-400 text-white text-xs font-semibold rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </AdminAuthGuard>
</template>

<script setup>
import AdminAuthGuard from '../user/auth/AdminAuthGuard.vue';
import { onMounted } from 'vue';
import { useWaiterAccountsPage } from './waiterAccountsPage.js';

const {
  waiters,
  loading,
  submitting,
  message,
  messageType,
  newUsername,
  newPassword,
  loadWaiters,
  createWaiter,
  deleteWaiter
} = useWaiterAccountsPage();

onMounted(() => {
  loadWaiters();
});
</script>
