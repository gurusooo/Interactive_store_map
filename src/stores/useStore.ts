import { create } from "zustand";
import { Product } from '../types/types';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

type PageKey = 'home' | 'catalog' | 'route' | 'account';

{/* const mockProducts: Product[] = [
    {
        id: "1",
        name: "Молоко Простоквашино 2.5%",
        price: 89,
        image: "-",
        category: "dept-milk",
        description: "Свежее пастеризованное молоко",
        weight: 1,
        location: { x: 100, y: 200 },
        shelf: 1
    },
    {
        id: "2",
        name: "Хлеб Бородинский",
        price: 45,
        image: "-",
        category: "dept-bread",
        description: "Ржаной хлеб с тмином",
        weight: 0.5,
        location: { x: 50, y: 100 },
        shelf: 3
    },
    {
        id: "3",
        name: "Сыр Российский",
        price: 420,
        image: "-",
        category: "dept-milk",
        description: "Твердый сыр 45%",
        weight: 0.5,
        location: { x: 120, y: 220 },
        shelf: 4
    }
]; */}

interface StoreActions {
    setCurrentPage: (page: PageKey) => void;
    setSearchQuery: (q: string) => void;
    addToRoute: (product: Product) => void;
    removeFromRoute: (productID: string) => void;
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
            console.log("Загрузка продуктов из Firebase..");
            const querySnapshot = await getDocs(collection(db, "products"));
            const products: Product[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                products.push({
                    category: data.category,
                    id: doc.id,
                    name: data.name,
                    price: data.price,
                    image: data.image,
                    description: data.description,
                    weight: data.weight,
                    shelf: data.volume,
                    date: data.date,
                    location: data.location || { x: 0, y: 0 }
                });
            });

            console.log(`Загружено ${products.length} продуктов`);
            set({ products, loading: false });
        } catch (error) {
            console.error("Ошибка загрузки продуктов:", error);
            set({
                error: "Не удалось загрузить товары",
                loading: false
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
