import { SaleItem } from "./sale-item.model";

export interface Sale {
    clientId: number;
    cashSessionId: number;
    paymentMethod: number;
    totalDiscount: number;
	amountReceived: number;
	change: number;
    items: SaleItem[];
}
