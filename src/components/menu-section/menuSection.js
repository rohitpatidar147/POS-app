import { onMounted, ref, computed, watch } from 'vue';

export const useMenuSection = () => {
  const menuItems = ref([]);
  const selectedCategory = ref('');
  const searchQuery = ref('');
  const loading = ref(false);
  const error = ref('');
  const isAdmin = ref(false);
  const categories = computed(() => {
    const cats = Array.from(new Set(menuItems.value.map((item) => item.category)));
    return ['All', ...cats.sort()];
  });

  const itemsInCategory = computed(() => {
    let filtered = menuItems.value;
    
    // Apply search filter if search query exists
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter((item) => 
        item.name.toLowerCase().startsWith(query) || 
        item.description.toLowerCase().startsWith(query)
      );
    } else if (selectedCategory.value && selectedCategory.value !== 'All') {
      // Apply category filter only if no search query and not "All"
      filtered = filtered.filter((item) => item.category === selectedCategory.value);
    }
    // If "All" is selected and no search, return all items (no filter)
    
    return filtered;
  });

  // Watch for search changes and update category accordingly
  watch(searchQuery, (newQuery) => {
    if (newQuery.trim()) {
      // When searching, update category to first result's category
      const query = newQuery.toLowerCase();
      const matches = menuItems.value.filter((item) => 
        item.name.toLowerCase().startsWith(query) || 
        item.description.toLowerCase().startsWith(query)
      );
      const firstMatch = matches[0];
      if (firstMatch) {
        selectedCategory.value = firstMatch.category;
      }
    }
  });

  const fetchMenuItems = async () => {
    loading.value = true;
    error.value = '';

    try {
      const response = await fetch('http://localhost:3000/api/menu-items');
      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error('Failed to load menu items.');
      }

      menuItems.value = Array.isArray(data)
        ? data.map((item) => ({
            id: Number(item?.id) || 0,
            name: String(item?.name || ''),
            imageUrl: String(item?.imageUrl || ''),
            description: String(item?.description || ''),
            category: String(item?.category || 'Uncategorized'),
            price: Number(item?.price) || 0
          }))
        : [];

      // Select first category by default
        if (categories.value.length > 0) {
          const firstCategory = categories.value[0];
          if (firstCategory) {
            selectedCategory.value = firstCategory; // This will be "All"
          }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Something went wrong while loading menu.';
    } finally {
      loading.value = false;
    }
  };

  const checkAdminRole = () => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        isAdmin.value = user.role === 'admin';
      } catch {
        isAdmin.value = false;
      }
    }
  };

  onMounted(() => {
    checkAdminRole();
    fetchMenuItems();
  });

  return {
    menuItems,
    selectedCategory,
    searchQuery,
    loading,
    error,
    isAdmin,
    categories,
    itemsInCategory
  };
};
