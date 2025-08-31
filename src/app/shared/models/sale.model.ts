export interface SaleItemRequest {
    productId: number;
    quantity: number;
    discount?: number;
}

export interface SaleRequest {
    clientId: number;
    cashSessionId: number;
    paymentMethod: number;
    totalDiscount?: number;
    items: SaleItemRequest[];
}

export interface SaleItemResponse {
    productId: number;
    name: string;
    quantity: number;
    price: number;
    discount: number;
    subtotal: number;
}

export interface SaleResponse {
    id: number;
    saleTimestamp: string;
    totalDiscount: number;
    totalValue: number;
    paymentMethod: 'CASH' | 'CREDIT' | 'DEBIT';
    clientId: number;
    cashSessionId: number;
    userId: number;
    items: SaleItemResponse[];
}
