import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export function useUserSettingsDropdown() {
  const router = useRouter();
  const open = ref(false);
  const avatarSrc = ref('https://ui-avatars.com/api/?name=Admin');
  const userRole = ref('admin');
  const currentUser = ref(null);

  const getCurrentUserRole = () => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        return user.role || 'admin';
      } catch {
        return 'admin';
      }
    }
    return 'admin';
  };

  const getCurrentUser = () => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  };

  const getProfileImageKey = () => {
    const user = getCurrentUser();
    if (!user) return 'adminProfileImage';
    
    if (user.role === 'waiter') {
      return `waiterProfileImage_${user.username}`;
    }
    return 'adminProfileImage';
  };

  const getPlaceholderAvatar = () => {
    const user = getCurrentUser();
    if (!user) return 'https://ui-avatars.com/api/?name=Admin';
    
    const name = user.username || (user.role === 'waiter' ? 'Waiter' : 'Admin');
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
  };

  const toggleMenu = () => {
    open.value = !open.value;
  };

  const handleClickOutside = (event) => {
    const target = event.target;
    if (!target) return;

    const root = document.getElementById('user-settings-dropdown-root');
    if (root && !root.contains(target)) {
      open.value = false;
    }
  };

  const goToCreateWaiter = () => {
    open.value = false;
    router.push('/admin/waiter-accounts');
  };

  const goToAddMenuItem = () => {
    open.value = false;
    router.push('/admin/add-menu-item');
  };

  const triggerAvatarUpload = () => {
    const fileInput = document.getElementById('avatar-file-input');
    console.log('triggerAvatarUpload called, fileInput:', fileInput);
    if (fileInput) {
      fileInput.value = '';
      console.log('Clicking file input...');
      fileInput.click();
    } else {
      console.warn('fileInput element not found');
    }
  };

  const handleFileChange = (event) => {
    const input = event.target;
    if (!input || !input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        avatarSrc.value = result;
        const key = getProfileImageKey();
        localStorage.setItem(key, result);
      }
    };

    reader.readAsDataURL(file);
  };

  const logout = () => {
    open.value = false;
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  onMounted(() => {
    currentUser.value = getCurrentUser();
    userRole.value = getCurrentUserRole();
    
    const key = getProfileImageKey();
    const savedAvatar = localStorage.getItem(key);
    
    if (savedAvatar) {
      avatarSrc.value = savedAvatar;
    } else {
      avatarSrc.value = getPlaceholderAvatar();
    }

    window.addEventListener('click', handleClickOutside);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('click', handleClickOutside);
  });

  return {
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
  };
}

