import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DenominationListComponent } from './denomination-list.component';

describe('DenominationListComponent', () => {
  let component: DenominationListComponent;
  let fixture: ComponentFixture<DenominationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DenominationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DenominationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
