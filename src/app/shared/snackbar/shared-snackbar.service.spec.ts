import { TestBed } from '@angular/core/testing';

import { SharedSnackbarService } from './shared-snackbar.service';

describe('SharedSnackbarService', () => {
  let service: SharedSnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedSnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
