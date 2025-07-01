import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUtilitySelectComponent } from './form-utility-select.component';

describe('FormUtilitySelectComponent', () => {
  let component: FormUtilitySelectComponent;
  let fixture: ComponentFixture<FormUtilitySelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormUtilitySelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormUtilitySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
