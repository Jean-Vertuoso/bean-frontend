import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUtilityButtonComponent } from './form-utility-button.component';

describe('FormUtilityButtonComponent', () => {
  let component: FormUtilityButtonComponent;
  let fixture: ComponentFixture<FormUtilityButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormUtilityButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormUtilityButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
