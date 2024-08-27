import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AuctionDraftService } from '@app/core/services/firestore/auction-draft/auction-draft.service';
import { SleeperService } from '@app/core/services/functions/sleeper/sleeper.service';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { LeagueUser } from '@app/core/models/sleeper/league-user.model';
import { DraftPick } from '@app/core/models/sleeper/draft-pick.model';
import { environment } from '@env/environment';

@Component({
  selector: 'app-auction-draft-tracker',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatTabsModule, 
    MatButtonModule, 
    MatInputModule, 
    MatTableModule,
    MatProgressBarModule],
  templateUrl: './auction-draft-tracker.component.html',
  styleUrl: './auction-draft-tracker.component.scss'
})
export class AuctionDraftTrackerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  totalBudget = 200;
  remainingBudget = 200;
  startersBudget = 170;
  remainingStartersBudget = 170;

  positions: { [key: string]: { min: number, max: number, spent: number } } = {
    QB: { min: 20, max: 30, spent: 0 },
    RB: { min: 61, max: 80, spent: 0 },
    WR: { min: 81, max: 100, spent: 0 },
    TE: { min: 1, max: 40, spent: 0 },
    FLEX: { min: 1, max: 30, spent: 0 }
  };

  positionInputs: { [key: string]: number } = {
    QB: 0, RB: 0, WR: 0, TE: 0, FLEX: 0
  };

  leagueOverview: any[] = [];
  draftPicks: any[] = [];

  leagueOverviewDataSource = new MatTableDataSource<LeagueUser>([]);
  draftPicksDataSource = new MatTableDataSource<DraftPick>([]);

  leagueOverviewColumns: string[] = ['username', 'totalSpent', 'startersSpent', 'benchSpent'];
  draftPicksColumns: string[] = ['pickNumber', 'playerName', 'position', 'team'];

  constructor(
    private draftService: AuctionDraftService,
    private sleeperService: SleeperService
  ) {}

  ngOnInit() {
    this.loadDraftData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addPlayer() {
    for (const [position, amount] of Object.entries(this.positionInputs)) {
      if (amount > 0) {
        this.positions[position].spent += amount;
        this.remainingBudget -= amount;
        this.remainingStartersBudget -= amount;
        this.positionInputs[position] = 0;
      }
    }

    // this.draftService.updateDraftData({
    //   remainingBudget: this.remainingBudget,
    //   remainingStartersBudget: this.remainingStartersBudget,
    //   positions: this.positions
    // });
  }

  loadLeagueData() {
    console.log('load league');
    const leagueId = environment.sleeper.league_id;
    this.sleeperService.getLeagueUsers(leagueId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (users: LeagueUser[]) => {
        console.log(users);
        const leagueOverview = users.map(user => ({
          ...user,
          totalSpent: 0, // Placeholder: calculate based on roster data
          startersSpent: 0, // Placeholder: calculate based on roster data
          benchSpent: 0 // Placeholder: calculate based on roster data
        }));
        this.leagueOverviewDataSource.data = leagueOverview;
      },
      error: (error) => console.error('Error loading league data:', error)
    });
  }

  calculateStartersSpent(roster: any): number {
    // Implement this based on your league's starter positions and the player costs
    // You might need to fetch player costs from draft results or another source
    return 0; // Placeholder
  }

  loadDraftData() {
    const draftId = environment.sleeper.draft_id;
    this.sleeperService.getDraftPicks(draftId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (picks: DraftPick[]) => {
        this.draftPicksDataSource.data = picks;
      },
      error: (error) => console.error('Error loading draft data:', error)
    });
  }
}