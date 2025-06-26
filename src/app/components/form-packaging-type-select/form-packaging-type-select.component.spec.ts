import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPackagingTypeSelectComponent } from './form-packaging-type-select.component';

describe('FormPackagingTypeSelectComponent', () => {
  let component: FormPackagingTypeSelectComponent;
  let fixture: ComponentFixture<FormPackagingTypeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPackagingTypeSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPackagingTypeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
