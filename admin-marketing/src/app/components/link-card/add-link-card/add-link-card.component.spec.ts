import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLinkCardComponent } from './add-link-card.component';

describe('AddLinkCardComponent', () => {
  let component: AddLinkCardComponent;
  let fixture: ComponentFixture<AddLinkCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLinkCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLinkCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
