import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMultiselectComponent } from './user-multiselect.component';

describe('UserMultiselectComponent', () => {
  let component: UserMultiselectComponent;
  let fixture: ComponentFixture<UserMultiselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMultiselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
