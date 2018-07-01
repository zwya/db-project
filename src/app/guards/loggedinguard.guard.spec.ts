import { TestBed, async, inject } from '@angular/core/testing';

import { LoggedinguardGuard } from './loggedinguard.guard';

describe('LoggedinguardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggedinguardGuard]
    });
  });

  it('should ...', inject([LoggedinguardGuard], (guard: LoggedinguardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
