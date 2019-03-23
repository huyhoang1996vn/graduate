import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotAdvsListComponent } from './hot-advs-list.component';

describe('HotAdvsListComponent', () => {
  let component: HotAdvsListComponent;
  let fixture: ComponentFixture<HotAdvsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotAdvsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotAdvsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
