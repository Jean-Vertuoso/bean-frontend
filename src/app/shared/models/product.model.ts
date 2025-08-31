export interface ProductRequest {
	id?: number;
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
	id: number;
	name: string;
	brand: string;
	price: number;
	barCode: string;
	imgUrl: string | null;
	packagingType: string;
	unitOfMeasure: string;
	categoryIds: number[];
}
