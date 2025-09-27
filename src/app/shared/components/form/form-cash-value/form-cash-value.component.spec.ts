import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCashValueComponent } from './form-cash-value.component';

describe('FormCashValueComponent', () => {
  let component: FormCashValueComponent;
  let fixture: ComponentFixture<FormCashValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCashValueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCashValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
