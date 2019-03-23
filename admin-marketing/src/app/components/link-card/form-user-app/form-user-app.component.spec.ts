import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUserAppComponent } from './form-user-app.component';

describe('FormUserAppComponent', () => {
  let component: FormUserAppComponent;
  let fixture: ComponentFixture<FormUserAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormUserAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormUserAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
