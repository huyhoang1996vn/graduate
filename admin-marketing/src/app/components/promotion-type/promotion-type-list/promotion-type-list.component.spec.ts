import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionTypeListComponent } from './promotion-type-list.component';

describe('PromotionTypeListComponent', () => {
  let component: PromotionTypeListComponent;
  let fixture: ComponentFixture<PromotionTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
