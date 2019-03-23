import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsFeedbackComponent } from './statistics-feedback.component';

describe('StatisticsFeedbackComponent', () => {
  let component: StatisticsFeedbackComponent;
  let fixture: ComponentFixture<StatisticsFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticsFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
