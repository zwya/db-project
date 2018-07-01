import { TestBed, async, inject } from '@angular/core/testing';

import { DefaultpageGuard } from './defaultpage.guard';

describe('DefaultpageGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DefaultpageGuard]
    });
  });

  it('should ...', inject([DefaultpageGuard], (guard: DefaultpageGuard) => {
    expect(guard).toBeTruthy();
  }));
});
