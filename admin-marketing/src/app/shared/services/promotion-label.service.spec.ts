import { TestBed, inject } from '@angular/core/testing';

import { PromotionLabelService } from './promotion-label.service';

describe('PromotionLabelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PromotionLabelService]
    });
  });

  it('should be created', inject([PromotionLabelService], (service: PromotionLabelService) => {
    expect(service).toBeTruthy();
  }));
});
