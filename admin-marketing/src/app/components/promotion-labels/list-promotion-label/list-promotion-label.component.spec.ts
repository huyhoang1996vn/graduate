import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPromotionLabelComponent } from './list-promotion-label.component';

describe('ListPromotionLabelComponent', () => {
  let component: ListPromotionLabelComponent;
  let fixture: ComponentFixture<ListPromotionLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPromotionLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPromotionLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
