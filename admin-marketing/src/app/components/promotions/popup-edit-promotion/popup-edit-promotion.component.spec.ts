import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupEditPromotionComponent } from './popup-edit-promotion.component';

describe('PopupEditPromotionComponent', () => {
  let component: PopupEditPromotionComponent;
  let fixture: ComponentFixture<PopupEditPromotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupEditPromotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupEditPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
