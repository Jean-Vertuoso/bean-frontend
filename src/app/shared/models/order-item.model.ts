export interface OrderItem {
    productId?: number;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    discount?: number;
    locked: boolean;
}
