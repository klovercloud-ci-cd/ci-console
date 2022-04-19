import { TestBed } from '@angular/core/testing';

import { SharedLayoutService } from './shared-layout.service';

describe('SharedLayoutService', () => {
  let service: SharedLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
