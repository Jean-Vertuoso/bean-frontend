import { TestBed } from '@angular/core/testing';

import { CashSessionService } from './cash-session.service';

describe('CashSessionService', () => {
	let service: CashSessionService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CashSessionService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
