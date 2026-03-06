import { useRouter } from 'vue-router';
import { useOrderStore } from '../../stores/orderStore';

export const useMenuCards = (props) => {
  const router = useRouter();
  const orderStore = useOrderStore();

  const editItem = (itemId) => {
    router.push(`/admin/edit-menu-item/${itemId}`);
  };

  const addToCart = (item) => {
    orderStore.addToCart({
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      price: item.price,
    });
  };

  return {
    editItem,
    addToCart
  };
};
