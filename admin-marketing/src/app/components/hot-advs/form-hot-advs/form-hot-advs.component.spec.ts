import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormHotAdvsComponent } from './form-hot-advs.component';

describe('FormHotAdvsComponent', () => {
  let component: FormHotAdvsComponent;
  let fixture: ComponentFixture<FormHotAdvsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormHotAdvsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormHotAdvsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
