import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration, VideoTileState
} from "amazon-chime-sdk-js";
import {ActivatedRoute, Router} from "@angular/router";
import {CallPageComponent} from "./call-page/call-page.component";
import {MeetService} from "../meet.service";
import { default as ChimeSDK, MeetingSession } from 'amazon-chime-sdk-js';

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

  // @ts-ignore
  static cofg: MeetingSessionConfiguration;
  isMessenger: boolean;
  messageAlert: any;
  resAttendee: any;
  isAudio: boolean;
  isVideo: boolean;
  // @ts-ignore
  @ViewChild('videoElement') videoElement: ElementRef;
  // @ts-ignore
  @ViewChild('remoteVideoElement') remoteVideoElement: ElementRef;
  private meetingSession: any;
  private stream: any;
  static resMeeting: any;

  constructor(
    private route: ActivatedRoute,
    private meetService: MeetService,
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
    this.isVideo = true;
    this.lname = localStorage.getItem("lname") || 'Guest';
    this.fname = localStorage.getItem("fname") || 'Guest';
  }

  ngOnInit() {
    if (this.isAdmin) {
      this.meetInfoPopup = true;
    }

    this.meetingId = <string>this.route.snapshot.paramMap.get('id');

    console.log("meet = " + PreviewPageComponent.resMeeting)
    this.createAttendee();

    PreviewPageComponent.cofg = new MeetingSessionConfiguration(
      PreviewPageComponent.resMeeting,
      this.resAttendee
    );
    this.prepare()

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
    // Connect to the Chime meeting
  /*const audioVideoElement = this.videoElement.nativeElement;
        this.meetingSession.audioVideo.start();
        this.meetingSession.audioVideo.addObserver({
          videoTileDidUpdate: (tileState: VideoTileState) => {
            if (tileState.localTile) {
              // @ts-ignore
              meetingSession.audioVideo.bindVideoElement(tileState.localTile.id, audioVideoElement);
            } else {
              // @ts-ignore
              const tileIndex = this.attendees.findIndex((attendee) => attendee.attendeeId === tileState.tileId);
              if (tileIndex !== -1) {
                const videoElement = this.remoteVideoElement.nativeElement;
                if (tileState.tileId != null) {
                  this.meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoElement);
                }
              }
            }
          },
          videoTileWasRemoved: (tileId: number) => {
            // @ts-ignore
            const tileIndex = this.attendees.findIndex((attendee) => attendee.attendeeId === tileId);
            if (tileIndex !== -1) {
              CallPageComponent.attendees.splice(tileIndex, 1);
            }
          },
        });*/
    await this.router.navigate([`/meets/${this.meetingId}/attendee/${PreviewPageComponent.attendeeId}`], {relativeTo: this.route});
  }

  async getRecieverCode() {

  }

  initWebRTC() {

  }

  getAttendeeId() {
    return PreviewPageComponent.attendeeId
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

  turnVideo() {
    this.isVideo = !this.isVideo;
    this.prepare()
  }

  turnAudio() {
    this.isAudio = !this.isAudio
    //this.meetingSession.audioVideo.realtimeUnmuteLocalAudio(this.isAudio);
    this.prepare()
    //this.joinMeeting()
  }

}

