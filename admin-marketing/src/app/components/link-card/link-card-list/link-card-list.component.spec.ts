import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkCardListComponent } from './link-card-list.component';

describe('LinkCardListComponent', () => {
  let component: LinkCardListComponent;
  let fixture: ComponentFixture<LinkCardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkCardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
