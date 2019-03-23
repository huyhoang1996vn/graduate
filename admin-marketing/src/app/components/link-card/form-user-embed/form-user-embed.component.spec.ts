import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUserEmbedComponent } from './form-user-embed.component';

describe('FormUserEmbedComponent', () => {
  let component: FormUserEmbedComponent;
  let fixture: ComponentFixture<FormUserEmbedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormUserEmbedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormUserEmbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
