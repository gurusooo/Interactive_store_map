export interface Product {
    id: number;
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

export interface CashRegister {
    //for further growth of the project, this interface is not in use yet
    id: string;
    name: string;
    type: 'cash' | 'electronic';
    location: {
        x: number;
        y: number;
    };
    status?: 'open' | 'closed' | 'busy';
}
