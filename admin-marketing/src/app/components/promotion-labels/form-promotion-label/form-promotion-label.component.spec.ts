import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPromotionLabelComponent } from './form-promotion-label.component';

describe('FormPromotionLabelComponent', () => {
  let component: FormPromotionLabelComponent;
  let fixture: ComponentFixture<FormPromotionLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPromotionLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPromotionLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
