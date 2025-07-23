export interface ProductRequest {
	name: string;
	brand: string;
	price: number;
	barCode: string;
	imgUrl: string | null;
	packagingType: string;
	unitOfMeasure: string;
	categoryIds: number[];
}

export interface ProductResponse {
	name: string;
	brand: string;
	price: number;
	imgUrl?: string | null;
}
