import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (productId: number, quantity: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: (products?: Map<number, number>) => number; // products map: productId -> price
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (productId, quantity) => {
        set((state) => {
          const existingItem = state.items.find(item => item.productId === productId);
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          
          return {
            items: [...state.items, { productId: productId, quantity }]
          };
        });
      },
      
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          ).filter(item => item.quantity > 0)
        }));
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.productId !== productId)
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: (products) => {
        if (!products) return 0;
        return get().items.reduce((total, item) => {
          const price = products.get(item.productId) || 0;
          return total + (price * item.quantity);
        }, 0);
      }
    }),
    {
      name: "cart-storage",
    }
  )
);
