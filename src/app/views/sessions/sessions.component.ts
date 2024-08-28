import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import { Analytics, logEvent } from '@angular/fire/analytics';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../core/services/auth/auth.service';
import { AccountService } from '@app/core/services/firestore';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  showLoginForm = true;
  showLoginPassword = false;
  showRegisterPassword = false;

  loggingIn: boolean = false;

  //private analytics: Analytics = inject(Analytics);

  public isNativeDevice: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private accountService: AccountService,
              private auth: AuthService,
              private router: Router,
              private cd: ChangeDetectorRef,
              private snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      agreed: [false, Validators.requiredTrue]
    });

    this.auth.loggingIn.subscribe((val) => {
      this.loggingIn = val;
      this.cd.detectChanges();
    });
  }

  async onLogin() {
    // Handle login form submission
    if (this.loginForm.valid) {
      try {
        const form = this.loginForm.value;
        const user_id = await this.auth.signIn(form);
        //logEvent(this.analytics, 'login');

        //const account = await this.accountService.getData(user_id);
        this.router.navigate(['/']);
      } catch(err: any) {
        this.snackBar.open(err?.message ? err.message : 'An error occurred while trying to login', 'OK', {duration: 3000});
        console.error(err);
      }
    }
  }

  async onRegister() {
    if (this.registerForm.valid) {
      try {
        const form = this.registerForm.value;
        await this.auth.register(form);
        //logEvent(this.analytics, 'register');
        this.router.navigate([this.isNativeDevice ? '/onboard' : '/']);
      } catch(err: any) {
        this.snackBar.open(err?.message ? err.message : 'An error occurred while trying to register', 'OK');
        console.error(err);
      }
      
    }
  }

  async onForgotPassword() {
    const email = this.loginForm.get('email')?.value;

    if (email) {
      try {
        await this.auth.sendPasswordResetEmail(email);
        this.snackBar.open('Check your email for a password reset link', 'OK', { duration: 5000 });
      } catch (err: any) {
        this.snackBar.open(err?.message ? err.message : 'An error occurred while trying to send reset password email', 'OK', { duration: 3000 });
        console.error(err);
      }
    } else {
      this.snackBar.open('Please enter your email address', 'OK', { duration: 3000 });
    }
  }

  toggleForm() {
    this.showLoginForm = !this.showLoginForm;
  }

  toggleLoginPasswordVisibility() {
    this.showLoginPassword = !this.showLoginPassword;
  }

  toggleRegisterPasswordVisibility() {
    this.showRegisterPassword = !this.showRegisterPassword;
  }
}
