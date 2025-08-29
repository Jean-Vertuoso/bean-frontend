export interface CashSessionResponse {
	id: number,
	openingTimestamp: Date;
	closingTimestamp?: Date;
	openingAmount: number;
	closingAmount?: number;
	expectedAmount?: number;
	notes?: string;
	status: string;
}
