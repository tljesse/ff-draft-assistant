import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, BehaviorSubject, Subscription } from 'rxjs';

import { serverTimestamp } from '@angular/fire/firestore';
import { Auth, User, user, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from '@angular/fire/auth';

import { AccountService } from '../firestore/account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  user$: Observable<User | null> = user(this.auth);
  public loggingIn = new BehaviorSubject<boolean>(false);

  userSubscription!: Subscription;
  hasInit: boolean = false;
  pauseUserInit!: boolean;
  pauseLogoutCheck!: boolean;

  constructor(private accountService: AccountService) {
    
  }
  
  init(): void {
    if (!this.hasInit) {
      this.hasInit = true;
      this.userSubscription = this.user$.subscribe((aUser: User | null) => {
        if (aUser?.uid && !this.pauseUserInit) {
          this.initializeUser(aUser.uid);
        }
      })
    }
  }

  async signIn(form: any, route?: string): Promise<any> {
    try {
      this.loggingIn.next(true);
      const user = await signInWithEmailAndPassword(this.auth, form.email, form.password);
      
      // this.analytics.logEvent('login', {
      //   account_id: user.user.uid,
      //   email: form.email
      // });
      this.loggingIn.next(false);
      return Promise.resolve(user.user.uid);
    } catch (err) {
      this.loggingIn.next(false);
      return Promise.reject(err);
    }
  }

  /**
   * Do auth signout and then clear any subscribptions in other services
   *
   * @since 0.0.0
   */
  async signOut(verify?: string) {
    await signOut(this.auth);
    this.accountService.doLogout();
    this.pauseLogoutCheck = false;

    return this.router.navigate(['/sign-in']);
  }

  /**
   * Register and create the user account document
   *
   * @since 0.0.1
   */
  async register(form: any): Promise<any> {
    try {
      this.loggingIn.next(true);
      this.pauseUserInit = true;

      const user = await createUserWithEmailAndPassword(this.auth, form.email, form.password);
      const user_id = user.user.uid;

      let data: any = {
        // uid: user.user.uid,
        // email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        //dateCreated: registeredOn,
        // user_type: 1,
        // coins: 0
      }

      //await this.signIn({email: form.email, password: form.password});

      var userDoc = null;

      do {
        setTimeout(() => {}, 500);
        userDoc = await this.accountService.getData(user_id);
      } while (userDoc === null || userDoc === undefined)

      data.online = true;
      data.last_seen = serverTimestamp();

      // Update the users account data
      const accountRes = await this.accountService.update(user_id, data);

      //this.setDisconnect(user_id);

      // Should initialize the user here since we paused automatic initialization
      this.initializeUser(user_id);

      this.pauseUserInit = false;

      this.loggingIn.next(false);
      return Promise.resolve(accountRes);
    } catch(error) {
      this.loggingIn.next(false);
      this.pauseUserInit = false;
      return Promise.reject(error);
    }
  }

  /**
   * Wait for the user doc to be created with a delay between checks
   *
   * @since 0.0.1
   */
  private async waitForDoc(userDoc_id: any) {
    let userDoc = null;// await this.accountService.getData(userDoc_id);
    if (!userDoc) {
      setTimeout(() => this.waitForDoc(userDoc_id), 1000)
    } else
      return userDoc;
  }
  
  /**
   * Check the login status
   *
   * @since 0.7.6
   */
  isLoggingIn() {
    return this.loggingIn.getValue();
  }

  /**
   * Send a password reset email to the given email address.
   *
   * @param email The email address to send the password reset email to.
   * @returns A promise that resolves when the email has been sent.
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      // Handle any errors here
      throw error;
    }
  }

  /**
   * Starts up any subscribtions in other services to create logged in user state
   * @param account_id The account_id of the user to initialize
   */
  private initializeUser(account_id: string) {
    this.accountService.initAccountInfo(account_id);
  }
}
