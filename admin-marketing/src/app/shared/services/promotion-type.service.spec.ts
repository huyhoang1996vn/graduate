import { TestBed, inject } from '@angular/core/testing';

import { PromotionTypeService } from './promotion-type.service';

describe('PromotionTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PromotionTypeService]
    });
  });

  it('should be created', inject([PromotionTypeService], (service: PromotionTypeService) => {
    expect(service).toBeTruthy();
  }));
});
