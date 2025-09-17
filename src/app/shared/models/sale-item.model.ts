export interface SaleItem {
    productId: number | undefined;
    name: string;
    quantity: number;
    price: number;
    discount: number;
    subtotal: number;
    locked: boolean;
}
