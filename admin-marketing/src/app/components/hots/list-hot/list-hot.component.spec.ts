import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHotComponent } from './list-hot.component';

describe('ListHotComponent', () => {
  let component: ListHotComponent;
  let fixture: ComponentFixture<ListHotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListHotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListHotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
