import { TestBed, inject } from '@angular/core/testing';

import { UpdaterequestService } from './updaterequest.service';

describe('UpdaterequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdaterequestService]
    });
  });

  it('should be created', inject([UpdaterequestService], (service: UpdaterequestService) => {
    expect(service).toBeTruthy();
  }));
});
