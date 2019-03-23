import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormHotComponent } from './form-hot.component';

describe('FormHotComponent', () => {
  let component: FormHotComponent;
  let fixture: ComponentFixture<FormHotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormHotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormHotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
