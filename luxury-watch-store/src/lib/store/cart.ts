import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (product: Product, quantity?: number, variantId?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Getters
  getItemCount: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getShipping: () => number;
  getTotal: () => number;
  getItemById: (itemId: string) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product: Product, quantity = 1, variantId?: string) => {
        const { items } = get();
        
        // Create a unique item ID based on product and variant
        const itemId = `${product.id}${variantId ? `-${variantId}` : ''}`;
        
        // Check if item already exists in cart
        const existingItemIndex = items.findIndex(item => item.id === itemId);
        
        if (existingItemIndex > -1) {
          // Update quantity of existing item
          const updatedItems = [...items];
          const existingItem = updatedItems[existingItemIndex];
          const maxQuantity = product.inventory?.quantity || 1;
          
          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: Math.min(existingItem.quantity + quantity, maxQuantity)
          };
          
          set({ items: updatedItems });
        } else {
          // Add new item to cart
          const newItem: CartItem = {
            id: itemId,
            productId: product.id,
            variantId,
            quantity: Math.min(quantity, product.inventory?.quantity || 1),
            product
          };
          
          set({ items: [...items, newItem] });
        }
        
        // Open cart drawer briefly to show item was added
        set({ isOpen: true });
        
        // Auto-close cart after 3 seconds
        setTimeout(() => {
          set({ isOpen: false });
        }, 3000);
      },
      
      removeItem: (itemId: string) => {
        const { items } = get();
        set({ items: items.filter(item => item.id !== itemId) });
      },
      
      updateQuantity: (itemId: string, quantity: number) => {
        const { items } = get();
        
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          set({ items: items.filter(item => item.id !== itemId) });
          return;
        }
        
        const updatedItems = items.map(item => {
          if (item.id === itemId) {
            const maxQuantity = item.product.inventory?.quantity || 1;
            return {
              ...item,
              quantity: Math.min(quantity, maxQuantity)
            };
          }
          return item;
        });
        
        set({ items: updatedItems });
      },
      
      clearCart: () => {
        set({ items: [], isOpen: false });
      },
      
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),
      
      getItemCount: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          return total + (Number(item.product.price) * item.quantity);
        }, 0);
      },
      
      getTax: () => {
        const subtotal = get().getSubtotal();
        const taxRate = 0.08; // 8% tax rate
        return subtotal * taxRate;
      },
      
      getShipping: () => {
        const subtotal = get().getSubtotal();
        // Free shipping over $1000
        return subtotal >= 1000 ? 0 : 50;
      },
      
      getTotal: () => {
        const { getSubtotal, getTax, getShipping } = get();
        return getSubtotal() + getTax() + getShipping();
      },
      
      getItemById: (itemId: string) => {
        const { items } = get();
        return items.find(item => item.id === itemId);
      }
    }),
    {
      name: 'luxury-watch-cart',
      storage: createJSONStorage(() => localStorage),
      // Only persist cart items, not the open state
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Hook to get cart statistics
export const useCartStats = () => {
  const itemCount = useCartStore(state => state.getItemCount());
  const subtotal = useCartStore(state => state.getSubtotal());
  const tax = useCartStore(state => state.getTax());
  const shipping = useCartStore(state => state.getShipping());
  const total = useCartStore(state => state.getTotal());
  
  return {
    itemCount,
    subtotal,
    tax,
    shipping,
    total,
    freeShippingRemaining: Math.max(0, 1000 - subtotal)
  };
};

// Hook to check if a product is in cart
export const useIsInCart = (productId: string, variantId?: string) => {
  const itemId = `${productId}${variantId ? `-${variantId}` : ''}`;
  const item = useCartStore(state => state.getItemById(itemId));
  return { isInCart: !!item, quantity: item?.quantity || 0 };
};