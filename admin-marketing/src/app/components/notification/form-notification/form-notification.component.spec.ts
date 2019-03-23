import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNotificationComponent } from './form-notification.component';

describe('FormNotificationComponent', () => {
  let component: FormNotificationComponent;
  let fixture: ComponentFixture<FormNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
