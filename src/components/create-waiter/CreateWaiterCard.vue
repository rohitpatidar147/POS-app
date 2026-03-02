<template>
  <section
    class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6 max-w-md"
  >
    <h2 class="text-lg font-semibold mb-1 text-slate-900">
      Create Waiter Account
    </h2>
    <p class="text-xs text-slate-500 mb-5">
      Add new waiters who can take orders on the POS.
    </p>

    <form @submit.prevent="createWaiter" class="space-y-4">
      <div>
        <label for="waiter-username" class="block text-sm font-medium mb-1">
          Waiter Username
        </label>
        <input
          id="waiter-username"
          v-model="waiterUsername"
          type="text"
          class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="New waiter username"
        />
      </div>

      <div>
        <label for="waiter-password" class="block text-sm font-medium mb-1">
          Waiter Password
        </label>
        <input
          id="waiter-password"
          v-model="waiterPassword"
          type="password"
          class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="New waiter password"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-semibold py-2 rounded-xl transition"
      >
        {{ loading ? 'Creating...' : 'Create Waiter' }}
      </button>
    </form>

    <p
      v-if="message"
      :class="[
        'mt-3 text-sm',
        messageType === 'error' ? 'text-red-600' : 'text-emerald-600'
      ]"
    >
      {{ message }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const waiterUsername = ref('');
const waiterPassword = ref('');
const loading = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

const getCurrentUserRole = () => {
  const stored = localStorage.getItem('currentUser');
  if (!stored) return null;
  try {
    const user = JSON.parse(stored);
    return user.role as string | null;
  } catch {
    return null;
  }
};

const createWaiter = async () => {
  message.value = '';
  messageType.value = 'success';

  if (!waiterUsername.value || !waiterPassword.value) {
    message.value = 'Please fill in both fields.';
    messageType.value = 'error';
    return;
  }

  const role = getCurrentUserRole();
  if (!role) {
    message.value = 'You are not logged in.';
    messageType.value = 'error';
    return;
  }

  loading.value = true;

  try {
    const response = await fetch('http://localhost:3000/api/auth/create-waiter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Role': role
      },
      body: JSON.stringify({
        username: waiterUsername.value,
        password: waiterPassword.value
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create waiter.');
    }

    message.value = `Waiter "${data.username}" created successfully.`;
    messageType.value = 'success';
    waiterUsername.value = '';
    waiterPassword.value = '';
  } catch (err: any) {
    message.value = err?.message || 'Something went wrong.';
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
};
</script>

