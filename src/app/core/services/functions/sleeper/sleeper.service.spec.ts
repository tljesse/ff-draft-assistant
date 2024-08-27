import { TestBed } from '@angular/core/testing';

import { SleeperService } from './sleeper.service';

describe('SleeperService', () => {
  let service: SleeperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SleeperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
