import { Routes } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

import { AuctionDraftTrackerComponent } from './views/auction-draft-tracker/auction-draft-tracker.component';
import { SessionsComponent } from './views/sessions/sessions.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);

export const routes: Routes = [
  {
    path: '',
    component: AuctionDraftTrackerComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'sign-in',
    component: SessionsComponent
  }
];
