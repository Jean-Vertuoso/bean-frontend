export interface SaleItem {
    productId?: number;
    name: string;
    quantity: number;
    price: number;
    discount?: number;
    subtotal: number;
    locked: boolean;
}
