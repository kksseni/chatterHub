import {Component, ElementRef, OnChanges, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {
  ConsoleLogger, DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,MeetingSessionCredentials,
  VideoTile
} from "amazon-chime-sdk-js";

import {MeetService} from "../../meet.service";
import {PreviewPageComponent} from "../preview-page.component";

@Component({
  selector: 'app-call-page',
  templateUrl: './call-page.component.html',
  styleUrls: ['./call-page.component.css']
})
export class CallPageComponent implements OnInit, OnChanges {
  static attendees: { attendeeId: string; lname: string; fname: string; stream: MediaStream }[] = [];
  stream: any;

  // @ts-ignore
  private attendeeId: string;
  // @ts-ignore
  private meetId: string;
  isAudio: boolean = true;
  isVideo: boolean = true;
  isCall: boolean = true;
  meetingSession: any;

  constructor(private meetService: MeetService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.prepare()
    this.attendeeId = <string>this.route.snapshot.paramMap.get('attendeeId');
    this.meetId = <string>this.route.snapshot.paramMap.get('id');

    window.onload = () => {
      this.onIsCallChange(false)
    };
  }

  localStream: MediaStream | undefined;

  ngOnChanges() {
    console.log("isAudio= " + this.isAudio)
    console.log("isVideo= " + this.isVideo)
  }

  async prepare() {
    if (this.meetingSession) {
      console.log("Meeting already in progress");
      return;
    }
    const logger = new ConsoleLogger('SDK', LogLevel.INFO);
    const deviceController = new DefaultDeviceController(logger);

    let configuration = PreviewPageComponent.cofg

    const constraints: MediaStreamConstraints = {audio: this.isAudio, video: this.isVideo};
    this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log("configuration = " + JSON.stringify(configuration))
    if (PreviewPageComponent.attendeeId && PreviewPageComponent.externalUserId && PreviewPageComponent.joinToken) {
      console.log("PreviewPageComponent.attendeeId &&PreviewPageComponent.externalUserId && PreviewPageComponent.joinToken")
      let meet = new MeetingSessionCredentials()
      meet.attendeeId = PreviewPageComponent.attendeeId
      meet.externalUserId = PreviewPageComponent.externalUserId
      meet.joinToken = PreviewPageComponent.joinToken
      configuration.credentials = meet;
    }
    this.meetingSession = new DefaultMeetingSession(
      configuration,
      logger,
      deviceController
    );

    const audioInputDevices = await this.meetingSession.audioVideo.listAudioInputDevices();
    const audioOutputDevices = await this.meetingSession.audioVideo.listAudioOutputDevices();
    const videoInputDevices = await this.meetingSession.audioVideo.listVideoInputDevices();

    console.log("start")
    // An array of MediaDeviceInfo objects
    audioInputDevices.forEach((mediaDeviceInfo: { deviceId: any; label: any; }) => {
      console.log(`Device ID: ${mediaDeviceInfo.deviceId} audioInputDevices: ${mediaDeviceInfo.label}`);
    });
    audioOutputDevices.forEach((mediaDeviceInfo: { deviceId: any; label: any; }) => {
      console.log(`Device ID: ${mediaDeviceInfo.deviceId} audioOutputDevices: ${mediaDeviceInfo.label}`);
    });
    videoInputDevices.forEach((mediaDeviceInfo: { deviceId: any; label: any; }) => {
      console.log(`Device ID: ${mediaDeviceInfo.deviceId} videoInputDevices: ${mediaDeviceInfo.label}`);
    });
    const audioInputDeviceInfo = audioInputDevices[0];
    await this.meetingSession.audioVideo.startAudioInput(audioInputDeviceInfo.deviceId);

    const audioOutputDeviceInfo = audioOutputDevices[0];
    await this.meetingSession.audioVideo.chooseAudioOutput(audioOutputDeviceInfo.deviceId);

    const videoInputDeviceInfo = videoInputDevices[0];
    await this.meetingSession.audioVideo.startVideoInput(videoInputDeviceInfo.deviceId);
    this.tiles = await this.meetingSession.audioVideo.getAllVideoTiles();
    let observer = {
      videoTileDidUpdate: (tileState: { boundAttendeeId: any; }) => {
        if (!(this.meetingSession === null)) {
          this.updateTiles();
        }
      },
    };

    this.meetingSession.audioVideo.addObserver(observer);
    const audioOutputElement = document.getElementById("meeting-audio");
    this.meetingSession.audioVideo.bindAudioElement(audioOutputElement);
    //this.meetingSession.audioVideo.realtimeSubscribeToAttendeeIdPresence(attendeeObserver);

    /*   const audioElement = document.getElementById('video-element-id');
       this.meetingSession.audioVideo.bindAudioElement(audioElement);*/

    this.meetingSession.audioVideo.start();
    this.meetingSession.audioVideo.startLocalVideoTile();

    console.log("end")
  }

  // @ts-ignore
  tiles: VideoTile[];
  @ViewChild('videoList', {static: true}) videoListRef!: ElementRef;

  updateTiles() {
    console.log("ghghghghgh1")
    const meetingSession = this.meetingSession; // Get your meeting session object here

    this.tiles = meetingSession.audioVideo.getAllVideoTiles();
    console.log("tiles.length = " + this.tiles.length)
    this.tiles.forEach((tile:VideoTile) => {
      const tileId = tile.state().tileId;

      const divElement = document.getElementById('div-' + tileId);
      if (!divElement) {
        const videoElement = document.getElementById('video-' + tileId);

        console.log("videoElement = " + videoElement)
        if (this.isVideo)
          meetingSession.audioVideo.bindVideoElement(tileId, videoElement);
        console.log("tileId = " + tileId)
      }
    });
  }

  getAttendees() {
    return CallPageComponent.attendees
  }

  async onIsAudioChange($event: boolean) {
    this.isAudio = $event
    if (this.isAudio) {
      const audioInputDevices = await this.meetingSession.audioVideo.listAudioInputDevices();
      const audioInputDeviceInfo = audioInputDevices[1];
      await this.meetingSession.audioVideo.startAudioInput(audioInputDeviceInfo.deviceId);
      this.meetingSession.audioVideo.start()
    } else this.meetingSession.audioVideo.stopAudioInput()
  }

  async onIsVideoChange($event: boolean) {
    this.isVideo = $event
    if (this.isVideo) {
      const videoInputDevices = await this.meetingSession.audioVideo.listVideoInputDevices();
      const videoInputDeviceInfo = videoInputDevices[1];
      await this.meetingSession.audioVideo.startVideoInput(videoInputDeviceInfo.deviceId);
      this.meetingSession.audioVideo.start()
      this.meetingSession.audioVideo.startLocalVideoTile()
    } else this.meetingSession.audioVideo.stopVideoInput()
  }

  onIsCallChange($event: boolean) {
    this.isCall = $event
    console.log(`this.meetId = ${this.meetId}, this.attendeeId = ${this.attendeeId}`)
    this.meetService.deleteAttendee(this.meetId, this.attendeeId).subscribe(async (res: any) => {
      }
    )
    this.router.navigate([`/meets`], {relativeTo: this.route});
  }
}
