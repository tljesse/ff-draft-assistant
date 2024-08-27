import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SleeperService {
  private functions: Functions = inject(Functions);

  private unwrapData<T>(obs: Observable<{ data: T }>): Observable<T> {
    return obs.pipe(map(response => response.data));
  }

  // User endpoints
  getUser(username: string): Observable<any> {
    return this.unwrapData(from(httpsCallable(this.functions, 'getUser')({ username })));
  }

  getUserLeagues(userId: string, sport: string, season: string): Observable<any> {
    return this.unwrapData(from(httpsCallable(this.functions, 'getUserLeagues')({ userId, sport, season })));
  }

  // League endpoints
  getLeague(leagueId: string): Observable<any> {
    return this.unwrapData(from(httpsCallable(this.functions, 'getLeague')({ leagueId })));
  }

  getLeagueRosters(leagueId: string): Observable<any> {
    return this.unwrapData(from(httpsCallable(this.functions, 'getLeagueRosters')({ leagueId })));
  }

  getLeagueUsers(leagueId: string): Observable<any> {
    return this.unwrapData(from(httpsCallable(this.functions, 'getLeagueUsers')({ leagueId })));
  }

  getLeagueMatchups(leagueId: string, week: number): Observable<any> {
    return this.unwrapData(from(httpsCallable(this.functions, 'getLeagueMatchups')({ leagueId, week })));
  }

  getLeagueWinnersBracket(leagueId: string): Observable<any> {
    return this.unwrapData(from(httpsCallable(this.functions, 'getLeagueWinnersBracket')({ leagueId })));
  }

  getLeagueLosersBracket(leagueId: string): Observable<any> {
    return this.unwrapData(from(httpsCallable(this.functions, 'getLeagueLosersBracket')({ leagueId })));
  }

  getLeagueTransactions(leagueId: string, round: number): Observable<any> {
    return this.unwrapData(from(httpsCallable(this.functions, 'getLeagueTransactions')({ leagueId, round })));
  }

  getLeagueTradedPicks(leagueId: string): Observable<any> {
    return this.unwrapData(from(httpsCallable(this.functions, 'getLeagueTradedPicks')({ leagueId })));
  }

  // Draft endpoints
  getUserDrafts(userId: string, sport: string, season: string): Observable<any> {
    return this.unwrapData(from(httpsCallable(this.functions, 'getUserDrafts')({ userId, sport, season })));
  }

  getLeagueDrafts(leagueId: string): Observable<any> {
    return this.unwrapData(from(httpsCallable(this.functions, 'getLeagueDrafts')({ leagueId })));
  }

  getDraft(draftId: string): Observable<any> {
    return this.unwrapData(from(httpsCallable(this.functions, 'getDraft')({ draftId })));
  }

  getDraftPicks(draftId: string): Observable<any> {
    return this.unwrapData(from(httpsCallable(this.functions, 'getDraftPicks')({ draftId })));
  }

  getDraftTradedPicks(draftId: string): Observable<any> {
    return this.unwrapData(from(httpsCallable(this.functions, 'getDraftTradedPicks')({ draftId })));
  }

  // NFL State
  getNflState(): Observable<any> {
    return this.unwrapData(from(httpsCallable(this.functions, 'getNflState')({})));
  }

  // Players
  getAllPlayers(): Observable<any> {
    return this.unwrapData(from(httpsCallable(this.functions, 'getAllPlayers')({})));
  }

  getTrendingPlayers(type: 'add' | 'drop', lookbackHours: number = 24, limit: number = 25): Observable<any> {
    return this.unwrapData(from(httpsCallable(this.functions, 'getTrendingPlayers')({ type, lookbackHours, limit })));
  }
}