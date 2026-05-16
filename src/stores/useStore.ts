import { create } from 'zustand';
import { Product } from '../types/types';
import { supabase } from '../lib/supabase';

type PageKey = 'home' | 'catalog' | 'route' | 'account';

interface StoreActions {
  setCurrentPage: (page: PageKey) => void;
  setSearchQuery: (q: string) => void;
  addToRoute: (product: Product) => void;
  removeFromRoute: (productID: number) => void;
  setSelectedDepartment: (departmentId: string | null) => void;
  setProducts: (products: Product[]) => void;
  setRoutePoints: (points: { x: number; y: number }[]) => void;
}

export interface StoreState {
  currentPage: PageKey;
  selectedDepartment: string | null;
  searchQuery: string;
  products: Product[];
  routeProducts: Product[];
  routePoints: { x: number; y: number }[];
  loading: boolean;
  error: string | null;
  loadProducts: () => Promise<void>;
}

export const useStore = create<StoreState & StoreActions>((set) => ({
  currentPage: 'home',
  selectedDepartment: null,
  searchQuery: '',
  products: [],
  routeProducts: [],
  routePoints: [],
  loading: false,
  error: null,

  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedDepartment: (departmentId) => set({ selectedDepartment: departmentId }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setProducts: (products) => set({ products }),

  loadProducts: async () => {
    set({ loading: true, error: null });
    try {
      console.log('Загрузка продуктов из Supabase...');

      const { data, error } = await supabase.from('products').select('*');

      if (error) {
        console.error('Supabase error:', error.message);
        set({
          error: 'Не удалось загрузить товары',
          loading: false,
        });
        return;
      }

      if (!data || data.length === 0) {
        console.log('Нет продуктов в базе');
        set({ products: [], loading: false });
        return;
      }

      const products: Product[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        description: item.description,
        image: item.image,
        weight: item.weight,
        date: item.date,
        location: item.location || { x: 0, y: 0 },
        shelf: item.shelf,
      }));

      console.log(`Загружено ${products.length} продуктов`);
      set({ products, loading: false });
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
      set({
        error: 'Не удалось загрузить товары',
        loading: false,
      });
    }
  },

  addToRoute: (product) =>
    set((state) =>
      state.routeProducts.find((p) => p.id === product.id)
        ? state
        : { routeProducts: [...state.routeProducts, product] }
    ),
  removeFromRoute: (productId) =>
    set((state) => ({
      routeProducts: state.routeProducts.filter((p) => p.id !== productId),
    })),
  setRoutePoints: (points) => set({ routePoints: points }),
}));
