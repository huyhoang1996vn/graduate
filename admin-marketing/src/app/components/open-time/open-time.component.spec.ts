import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenTimeComponent } from './open-time.component';

describe('OpenTimeComponent', () => {
  let component: OpenTimeComponent;
  let fixture: ComponentFixture<OpenTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
