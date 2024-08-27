import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionDraftTrackerComponent } from './auction-draft-tracker.component';

describe('AuctionDraftTrackerComponent', () => {
  let component: AuctionDraftTrackerComponent;
  let fixture: ComponentFixture<AuctionDraftTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionDraftTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctionDraftTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
