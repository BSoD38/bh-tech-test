import { TestBed } from '@angular/core/testing';

import { FilteringApiService } from './filtering-api.service';

describe('FilteringApiService', () => {
  let service: FilteringApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilteringApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
