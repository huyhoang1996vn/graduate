import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkCardDetailComponent } from './link-card-detail.component';

describe('LinkCardDetailComponent', () => {
  let component: LinkCardDetailComponent;
  let fixture: ComponentFixture<LinkCardDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkCardDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkCardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
