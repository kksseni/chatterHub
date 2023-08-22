import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MeetingSessionConfiguration} from "amazon-chime-sdk-js";
import {ActivatedRoute, Router} from "@angular/router";
import {MeetService} from "../meet.service";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import * as events from "events";
import {WebcamComponent, WebcamImage, WebcamInitError} from "ngx-webcam";

@Component({
  selector: 'app-preview-page',
  templateUrl: './preview-page.component.html',
  styleUrls: ['./preview-page.component.css']
})
export class PreviewPageComponent implements OnInit, OnDestroy {
  id: string;
  isAdmin: boolean;
  url: string;
  meetingId: string | undefined;
  alertTimeout: any;
  messageList: any[];
  streamObj: any;
  screenCastStream: any;
  meetInfoPopup: boolean;
  isPresenting: boolean;
  lname: string | undefined;
  fname: string | undefined;
  localStream: MediaStream | undefined;
  static attendeeId: string | undefined;
  static externalUserId: string | undefined;
  static joinToken: string | undefined;

  videoDeviceId: string | undefined;
  audioInputDeviceId: string | undefined;
  audioOutputDeviceId: string | undefined;

  // @ts-ignore
  static cofg: MeetingSessionConfiguration;
  isMessenger: boolean;
  messageAlert: any;
  resAttendee: any;
  isAudio: boolean;
  isVideo: boolean;

  videoDevices: MediaDeviceInfo[] = [];
  // @ts-ignore
  videoOptions: MediaTrackConstraints;
  // @ts-ignore
  @ViewChild('videoElement') videoElement: ElementRef;
  // @ts-ignore
  @ViewChild('remoteVideoElement') remoteVideoElement: ElementRef;
  private stream: any;
  static resMeeting: any;

  constructor(
    private route: ActivatedRoute,
    private meetService: MeetService,
    private router: Router,
    private dialog: MatDialog
  ) {
    // @ts-ignore
    this.id = this.route.snapshot.params.id;
    this.isAdmin = window.location.hash === '#init';
    this.url = `${window.location.origin}${window.location.pathname}`;
    this.alertTimeout = null;
    // @ts-ignore
    this.videoOptions = {facingMode: 'en', deviceId:  localStorage.getItem("videoInputDevice")};
    console.log(" this.videoOptions = " +  this.videoOptions.deviceId)
    this.messageList = [];
    this.streamObj = null;
    this.screenCastStream = null;
    this.meetInfoPopup = false;
    this.isPresenting = false;
    this.isMessenger = false;
    this.messageAlert = {};
    this.isAudio = true;
    this.isVideo = true;
    this.lname = localStorage.getItem("lname") || 'Guest';
    this.fname = localStorage.getItem("fname") || 'Guest';
  }

  async ngOnInit() {
    if (this.isAdmin) {
      this.meetInfoPopup = true;
    }
    this.meetingId = <string>this.route.snapshot.paramMap.get('id');
    if(!PreviewPageComponent.resMeeting){
      await this.meetService.checkMeeting(this.meetingId).subscribe((res:any)=>{
        PreviewPageComponent.resMeeting = res;
        console.log("PreviewPageComponent.resMeeting = "+ PreviewPageComponent.resMeeting)
      } )
    }

    console.log("meet = " + PreviewPageComponent.resMeeting)

   /* this.videoOptions = {facingMode: 'environment', deviceId: this.videoDeviceId};
    console.log("this.videoDeviceId = " + this.videoDeviceId)*/
  }

  ngOnDestroy() {

  }

  private createAttendee() {
    this.meetService.newAttendee(this.meetingId).subscribe(async (res: Object) => {
      // @ts-ignore
      PreviewPageComponent.attendeeId = res.attendeeId;
      // @ts-ignore
      PreviewPageComponent.externalUserId = res.externalUserId;
      // @ts-ignore
      PreviewPageComponent.joinToken = res.joinToken;
      console.log("this.attendeeId =" + PreviewPageComponent.attendeeId)
      console.log("this.attendee =" + JSON.stringify(res))
      this.resAttendee = res;
    })
  }

  async prepare() {
    console.log("this.isAudio=" + this.isAudio)
    console.log("this.attendeeId =" + PreviewPageComponent.attendeeId)
    let ctx = new AudioContext();
    const constraints: MediaStreamConstraints = {audio: this.isAudio, video: this.isVideo};

    if (this.isAudio || this.isVideo) {
      console.log("first")
      console.log("this.isAudio=" + this.isAudio)
      console.log("this.isVideo=" + this.isVideo)
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    }
    if (!this.isAudio && !this.isVideo) {
      console.log("this.isAudio=" + this.isAudio)
      console.log("this.isVideo=" + this.isVideo)
      this.stream.getVideoTracks()[0].stop();
    }
    this.localStream = this.stream;
  }

  async joinMeeting() {
    this.createAttendee();
    PreviewPageComponent.cofg = new MeetingSessionConfiguration(
      PreviewPageComponent.resMeeting,
      this.resAttendee
    );
    await this.router.navigate([`/meets/${this.meetingId}/attendee/${PreviewPageComponent.attendeeId}`], {relativeTo: this.route});
  }

  getAttendeeId() {
    return PreviewPageComponent.attendeeId
  }

  turnVideo() {
    this.isVideo = !this.isVideo;
    this.prepare()
  }

  turnAudio() {
    this.isAudio = !this.isAudio
    this.prepare()
  }

  private async initSettings() {
    let mediaStream = await navigator.mediaDevices.getUserMedia({audio: this.isAudio, video: this.isVideo});
    this.videoDeviceId =   localStorage.getItem("videoInputDevice") || mediaStream.getVideoTracks()[0].label
    this.audioInputDeviceId = localStorage.getItem("audioInputDevice") || mediaStream.getAudioTracks()[0].label
  }
}
