import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionFormDetailComponent } from './promotion-form-detail.component';

describe('PromotionFormDetailComponent', () => {
  let component: PromotionFormDetailComponent;
  let fixture: ComponentFixture<PromotionFormDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionFormDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionFormDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
