import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCategorySelectComponent } from './form-category-select.component';

describe('FormCategorySelectComponent', () => {
  let component: FormCategorySelectComponent;
  let fixture: ComponentFixture<FormCategorySelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCategorySelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCategorySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
