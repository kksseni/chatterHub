import { Component, OnInit, OnDestroy } from '@angular/core';
import { faUserFriends, faCommentAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { interval, Subscription } from 'rxjs';


@Component({
  selector: 'app-call-page-header',
  templateUrl: `./call-page-header.component.html`,
  styleUrls: ['./call-page-header.component.css']
})
export class CallPageHeaderComponent implements OnInit, OnDestroy {
  faUserFriends = faUserFriends;
  faCommentAlt = faCommentAlt;
  faUserCircle = faUserCircle;
  intervalSubscription: Subscription | undefined;

  isMessenger: boolean;
  messageAlert: any;

  constructor() {

    this.isMessenger = false;
    this.messageAlert = {};
  }

  ngOnInit() {
    this.intervalSubscription = interval(1000).subscribe(() => {

    });
  }

  ngOnDestroy() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  openMessenger() {
    this.isMessenger = true;
    this.messageAlert = {};
  }

  setIsMessenger(b: boolean) {

  }

  setMessageAlert(param: {}) {

  }
}
