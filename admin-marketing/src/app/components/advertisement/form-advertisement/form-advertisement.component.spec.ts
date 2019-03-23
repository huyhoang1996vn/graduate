import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAdvertisementComponent } from './form-advertisement.component';

describe('FormAdvertisementComponent', () => {
  let component: FormAdvertisementComponent;
  let fixture: ComponentFixture<FormAdvertisementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAdvertisementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAdvertisementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
