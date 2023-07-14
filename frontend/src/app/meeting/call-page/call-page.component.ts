import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-call-page',
  templateUrl: `./call-page.component.html`,
  styleUrls: ['./call-page.component.css']
})
export class CallPageComponent implements OnInit, OnDestroy {
  id: string;
  isAdmin: boolean;
  url: string;
  alertTimeout: any;

  messageList: any[];
  streamObj: any;
  screenCastStream: any;
  meetInfoPopup: boolean;
  isPresenting: boolean;
  isMessenger: boolean;
  messageAlert: any;
  isAudio: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    // @ts-ignore
    this.id = this.route.snapshot.params.id;
    this.isAdmin = window.location.hash === '#init';
    this.url = `${window.location.origin}${window.location.pathname}`;
    this.alertTimeout = null;

    this.messageList = [];
    this.streamObj = null;
    this.screenCastStream = null;
    this.meetInfoPopup = false;
    this.isPresenting = false;
    this.isMessenger = false;
    this.messageAlert = {};
    this.isAudio = true;
  }

  ngOnInit() {
    if (this.isAdmin) {
      this.meetInfoPopup = true;
    }
  }

  ngOnDestroy() {

  }

  async getRecieverCode() {

  }

  initWebRTC() {

  }

  sendMsg($event: any) {

  }

  screenShare() {

  }

  stopScreenShare() {
  }

  toggleAudio($event: any) {
  }

  disconnectCall() {
  }

  setIsMessenger($event: any) {

  }

  setMeetInfoPopup($event: any) {

  }

  setMessageAlert($event: any) {

  }
}
