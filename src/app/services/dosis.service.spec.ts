import { TestBed } from '@angular/core/testing';

import { DosisService } from './dosis.service';

describe('DosisService', () => {
  let service: DosisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DosisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
