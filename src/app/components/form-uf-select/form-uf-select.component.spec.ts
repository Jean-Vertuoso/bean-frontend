import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUfSelectComponent } from './form-uf-select.component';

describe('FormUfSelectComponent', () => {
  let component: FormUfSelectComponent;
  let fixture: ComponentFixture<FormUfSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormUfSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormUfSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
