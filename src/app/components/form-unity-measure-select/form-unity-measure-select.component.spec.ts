import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUnityMeasureSelectComponent } from './form-unity-measure-select.component';

describe('FormUnityMeasureSelectComponent', () => {
  let component: FormUnityMeasureSelectComponent;
  let fixture: ComponentFixture<FormUnityMeasureSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormUnityMeasureSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormUnityMeasureSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
