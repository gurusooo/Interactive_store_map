export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    image: string;
    weight: number;
    date?: number;
    location: { x: number; y: number };
    shelf: number;
}
export interface Department {
    id: string;
    name: string;
    coordinates: { x: number; y: number; width: number; height: number };
}

export interface StoreState {
    products: Product[];
    departments: Department[];
    searchQuery: string;
    routeProducts: Product[];
    selectedDepartment: string | null;
}

export interface CashRegister {
    id: string;
    name: string;
    type: 'cash' | 'electronic';
    location: {
        x: number;
        y: number;
    };
    status?: 'open' | 'closed' | 'busy';
}
