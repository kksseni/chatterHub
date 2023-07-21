import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration, VideoTileState
} from "amazon-chime-sdk-js";


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
  name: string | undefined;
  localStream: MediaStream | undefined;
  static attendeeId: string | undefined;
  attendees: { attendeeId: string; stream: MediaStream }[] = [];
  static cofg: MeetingSessionConfiguration;
  isMessenger: boolean;
  messageAlert: any;
  isAudio: boolean;
  isVideo: boolean;
  // @ts-ignore
  @ViewChild('videoElement') videoElement: ElementRef;
  // @ts-ignore
  @ViewChild('remoteVideoElement') remoteVideoElement: ElementRef;
  private meetingSession: any;
  private stream: any;
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
    this.isVideo = true;
  }

  ngOnInit() {
    if (this.isAdmin) {
      this.meetInfoPopup = true;
    }
    this.prepare()
  }

  ngOnDestroy() {

  }
  async prepare() {
    console.log("this.isAudio="+this.isAudio)
    let ctx = new AudioContext();
    const constraints: MediaStreamConstraints = {audio: this.isAudio, video: this.isVideo};

    if (this.isAudio || this.isVideo){
      console.log("first")
      console.log("this.isAudio="+this.isAudio)
      console.log("this.isVideo="+this.isVideo)
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    }
    if (!this.isAudio && !this.isVideo){
      console.log("this.isAudio="+this.isAudio)
      console.log("this.isVideo="+this.isVideo)
      this.stream.getVideoTracks()[0].stop();
    }
    this.localStream = this.stream;
    const logger = new ConsoleLogger('ChimeMeeting', LogLevel.INFO);
    const deviceController = new DefaultDeviceController(logger);
    this.meetingSession = new DefaultMeetingSession(CallPageComponent.cofg, logger, deviceController);
    this.name = localStorage.getItem("name") || 'Guest';
  }

  async joinMeeting() {
    // Add the local stream to the attendee's list
    if (CallPageComponent.attendeeId)
      { // @ts-ignore
        this.attendees.push({ attendeeId: CallPageComponent.attendeeId, stream: this.localStream });
      }

    // Connect to the Chime meeting
    const audioVideoElement = this.videoElement.nativeElement;

   // this.meetingSession.audioVideo.start();
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
          this.attendees.splice(tileIndex, 1);
        }
      },
    });
  }

  async getRecieverCode() {

  }

  initWebRTC() {

  }
  getAttendeeId() {
  return CallPageComponent.attendeeId
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
