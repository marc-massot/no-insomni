import { TestBed } from '@angular/core/testing';

import { DiesService } from './dies.service';

describe('DiesService', () => {
  let service: DiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
