import { TestBed, inject } from '@angular/core/testing';

import { HotAdvsService } from './hot-advs.service';

describe('HotAdvsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HotAdvsService]
    });
  });

  it('should be created', inject([HotAdvsService], (service: HotAdvsService) => {
    expect(service).toBeTruthy();
  }));
});
