import { TestBed, inject } from '@angular/core/testing';

import { UserPermissionService } from './user-permission.service';

describe('UserPermissionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserPermissionService]
    });
  });

  it('should be created', inject([UserPermissionService], (service: UserPermissionService) => {
    expect(service).toBeTruthy();
  }));
});
