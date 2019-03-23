import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEventComponent } from './form-event.component';

describe('FormEventComponent', () => {
  let component: FormEventComponent;
  let fixture: ComponentFixture<FormEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
