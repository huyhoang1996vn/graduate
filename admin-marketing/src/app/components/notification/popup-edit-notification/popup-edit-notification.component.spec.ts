import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupEditNotificationComponent } from './popup-edit-notification.component';

describe('PopupEditNotificationComponent', () => {
  let component: PopupEditNotificationComponent;
  let fixture: ComponentFixture<PopupEditNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupEditNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupEditNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
