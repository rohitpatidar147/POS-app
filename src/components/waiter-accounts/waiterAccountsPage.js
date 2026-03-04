import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useWaiterAccountsPage() {
  const router = useRouter();
  const waiters = ref([]);
  const loading = ref(false);
  const submitting = ref(false);
  const message = ref('');
  const messageType = ref('success');
  
  const newUsername = ref('');
  const newPassword = ref('');

  const getCurrentUserRole = () => {
    const stored = localStorage.getItem('currentUser');
    if (!stored) return null;

    try {
      const user = JSON.parse(stored);
      return user.role || null;
    } catch {
      return null;
    }
  };

  const loadWaiters = async () => {
    loading.value = true;
    message.value = '';

    const role = getCurrentUserRole();
    if (!role) {
      message.value = 'You are not logged in.';
      messageType.value = 'error';
      loading.value = false;
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/waiters', {
        method: 'GET',
        headers: {
          'X-User-Role': role
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load waiters.');
      }

      const data = await response.json();
      waiters.value = Array.isArray(data) ? data : [];
    } catch (err) {
      message.value = err?.message || 'Something went wrong.';
      messageType.value = 'error';
    } finally {
      loading.value = false;
    }
  };

  const createWaiter = async () => {
    message.value = '';
    messageType.value = 'success';

    if (!newUsername.value.trim() || !newPassword.value.trim()) {
      message.value = 'Please fill in both username and password.';
      messageType.value = 'error';
      return;
    }

    const role = getCurrentUserRole();
    if (!role) {
      message.value = 'You are not logged in.';
      messageType.value = 'error';
      return;
    }

    submitting.value = true;

    try {
      const response = await fetch('http://localhost:3000/api/auth/create-waiter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': role
        },
        body: JSON.stringify({
          username: newUsername.value.trim(),
          password: newPassword.value.trim()
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create waiter.');
      }

      message.value = `Waiter "${data.username}" created successfully.`;
      messageType.value = 'success';
      newUsername.value = '';
      newPassword.value = '';
      
      // Reload waiters list
      await loadWaiters();
    } catch (err) {
      message.value = err?.message || 'Something went wrong.';
      messageType.value = 'error';
    } finally {
      submitting.value = false;
    }
  };

  const deleteWaiter = async (waiterId, waiterUsername) => {
    if (!confirm(`Are you sure you want to delete the account "${waiterUsername}"? This cannot be undone.`)) {
      return;
    }

    message.value = '';
    messageType.value = 'success';

    const role = getCurrentUserRole();
    if (!role) {
      message.value = 'You are not logged in.';
      messageType.value = 'error';
      return;
    }

    submitting.value = true;

    try {
      const response = await fetch(`http://localhost:3000/api/auth/waiters/${waiterId}`, {
        method: 'DELETE',
        headers: {
          'X-User-Role': role
        }
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete waiter.');
      }

      message.value = data.message || 'Waiter deleted successfully.';
      messageType.value = 'success';
      
      // Reload waiters list
      await loadWaiters();
    } catch (err) {
      message.value = err?.message || 'Something went wrong.';
      messageType.value = 'error';
    } finally {
      submitting.value = false;
    }
  };

  return {
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
  };
}
