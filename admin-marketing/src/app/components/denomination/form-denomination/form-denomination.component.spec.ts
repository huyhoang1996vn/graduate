import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDenominationComponent } from './form-denomination.component';

describe('FormDenominationComponent', () => {
  let component: FormDenominationComponent;
  let fixture: ComponentFixture<FormDenominationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDenominationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDenominationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
