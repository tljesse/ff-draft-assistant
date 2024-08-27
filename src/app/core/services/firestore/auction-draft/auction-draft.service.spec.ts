import { TestBed } from '@angular/core/testing';

import { AuctionDraftService } from './auction-draft.service';

describe('AuctionDraftService', () => {
  let service: AuctionDraftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuctionDraftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
