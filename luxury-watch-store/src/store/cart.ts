import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  brand: string;
  image: string;
  slug: string;
  sku: string;
  quantity: number;
  inStock: boolean;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotals: () => {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      totalItems: 0,
      totalPrice: 0,

      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === newItem.id);
          
          let updatedItems;
          if (existingItem) {
            // Increase quantity if item already exists
            updatedItems = state.items.map(item =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            // Add new item with quantity 1
            updatedItems = [...state.items, { ...newItem, quantity: 1 }];
          }

          const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

          return {
            items: updatedItems,
            totalItems,
            totalPrice,
          };
        });
      },

      removeItem: (id) => {
        set((state) => {
          const updatedItems = state.items.filter(item => item.id !== id);
          const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

          return {
            items: updatedItems,
            totalItems,
            totalPrice,
          };
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => {
          const updatedItems = state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          );

          const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

          return {
            items: updatedItems,
            totalItems,
            totalPrice,
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotals: () => {
        const subtotal = get().totalPrice;
        const tax = subtotal * 0.08875; // NY tax rate
        const shipping = subtotal > 500 ? 0 : 25; // Free shipping over $500
        const total = subtotal + tax + shipping;
        
        return {
          subtotal,
          tax,
          shipping,
          total,
        };
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);