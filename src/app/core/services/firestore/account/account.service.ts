import { Injectable } from '@angular/core';
import { Firestore, serverTimestamp } from '@angular/fire/firestore';

import { BehaviorSubject, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { Account } from '@app/core/models/firestore/account.model';

import { ApiFirestoreService } from '../../api-firestore/api-firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends ApiFirestoreService<Account> {
  private ngUnsubscribe!: Subject<any>;

  private accountInfo = new BehaviorSubject<Account>(null as any);
  currentAccountInfo = this.accountInfo.asObservable().pipe(distinctUntilChanged());
  accountLoaded: boolean = false;

  constructor(afs: Firestore) {
    super('accounts', afs);
  }

  /**
   * Initialize the user account and watch it, to be subscribed to around the app
   *
   * @since 0.0.1
   */
  initAccountInfo(uid: string) {

    if (!this.accountLoaded && uid) {
      this.ngUnsubscribe = new Subject();
      this.watch(uid).pipe(takeUntil(this.ngUnsubscribe)).subscribe(accountInfo => {
        // if (!environment.production) {
        //   console.info('ACCOUNT INFO ', accountInfo);
        // }
        this.accountInfo.next(accountInfo);

        if (accountInfo?._id && !this.accountLoaded) {
          this.accountLoaded = true;
          this.update(accountInfo._id, {last_seen: serverTimestamp()});
        }
      });
    }
  }

  /**
   * Unsubscribe from the user account document and clear the behavior subject
   *
   * @since 0.0.1
   */
  doLogout() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
    //this.authorizationService.unLoadUserPermissions();
    this.accountInfo.next(null as any);
    this.accountLoaded = false;
  }
}
