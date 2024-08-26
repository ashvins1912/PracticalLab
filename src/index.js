import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();




import { Injectable, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Observable, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TimeoutDialogComponent } from './timeout-dialog/timeout-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private readonly idleTimeout = 15 * 60 * 1000; // 15 minutes
  private readonly countdownStart = 60; // 60 seconds countdown
  private idleTimer: any;
  private countdownTimer: any;
  private idle$ = new Subject<void>();
  private stopCountdown$ = new Subject<void>();
  private isLoggedIn = false;

  constructor(private dialog: MatDialog, private ngZone: NgZone) {}

  startWatching() {
    if (this.isLoggedIn) {
      this.resetTimer();

      // Listen to user actions
      ['mousemove', 'keydown', 'click'].forEach(event => {
        document.addEventListener(event, () => this.resetTimer());
      });
    }
  }

  stopWatching() {
    clearTimeout(this.idleTimer);
  }

  login() {
    this.isLoggedIn = true;
    this.startWatching();
  }

  logout() {
    this.isLoggedIn = false;
    this.stopWatching();
    // Add your logout logic here, e.g., redirect to the login page
    console.log('Logged out due to inactivity.');
    // this.authService.logout();
  }

  private resetTimer() {
    if (this.isLoggedIn) {
      clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(() => this.idle$.next(), this.idleTimeout);
    }
  }

  onIdle(): Observable<void> {
    return this.idle$.asObservable();
  }

  startCountdown() {
    this.countdownTimer = timer(0, 1000).pipe(
      takeUntil(this.stopCountdown$)
    );

    return this.countdownTimer;
  }

  stopCountdown() {
    this.stopCountdown$.next();
  }

  openTimeoutDialog() {
    const dialogRef = this.dialog.open(TimeoutDialogComponent, {
      width: '300px',
      disableClose: true,
      data: { countdown: this.countdownStart }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'continue') {
        this.resetTimer();
      } else {
        this.logout();
      }
    });

    this.startCountdown().subscribe(count => {
      if (count >= this.countdownStart) {
        this.logout();
        this.stopCountdown();
        dialogRef.close();
      }
    });
  }
}
