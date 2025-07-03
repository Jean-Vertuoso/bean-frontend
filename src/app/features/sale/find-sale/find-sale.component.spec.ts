import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindSaleComponent } from './find-sale.component';

describe('FindSaleComponent', () => {
  let component: FindSaleComponent;
  let fixture: ComponentFixture<FindSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindSaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
