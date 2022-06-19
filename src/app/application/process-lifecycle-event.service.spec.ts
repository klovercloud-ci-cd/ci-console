import { TestBed } from '@angular/core/testing';

import { ProcessLifecycleEventService } from './process-lifecycle-event.service';

describe('ProcessLifecycleEventService', () => {
  let service: ProcessLifecycleEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessLifecycleEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
