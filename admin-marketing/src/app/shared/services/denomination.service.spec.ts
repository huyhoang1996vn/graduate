import { TestBed, inject } from '@angular/core/testing';

import { DenominationService } from './denomination.service';

describe('DenominationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DenominationService]
    });
  });

  it('should be created', inject([DenominationService], (service: DenominationService) => {
    expect(service).toBeTruthy();
  }));
});
