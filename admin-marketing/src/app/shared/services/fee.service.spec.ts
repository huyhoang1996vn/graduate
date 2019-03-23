import { TestBed, inject } from '@angular/core/testing';

import { FeeService } from './fee.service';

describe('FeeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeeService]
    });
  });

  it('should be created', inject([FeeService], (service: FeeService) => {
    expect(service).toBeTruthy();
  }));
});
