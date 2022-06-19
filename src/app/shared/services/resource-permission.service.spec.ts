import { TestBed } from '@angular/core/testing';

import { ResourcePermissionService } from './resource-permission.service';

describe('ResourcePermissionService', () => {
  let service: ResourcePermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourcePermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
