import { TestBed } from '@angular/core/testing';

import { AttachCompanyService } from './attach-company.service';

describe('AttachCompanyService', () => {
  let service: AttachCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttachCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
