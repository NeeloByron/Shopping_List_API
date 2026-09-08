// Data shapes (types/interfaces)
export interface Item {
    id: string;
    name: string;
    quantity: number;
    purchased: boolean;
}

// add 
export interface CreateItem {
    name: string;
    quantity: number;
}

// update 
export interface UpdateItem {
    name?: string;
    quantity?: number;
    purchased?: boolean;
}

export interface apiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}