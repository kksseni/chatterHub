import {Component, OnChanges, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {
  ConsoleLogger, DefaultDeviceController,
  DefaultMeetingSession,
  DefaultMessagingSession,
  LogLevel, MeetingSessionConfiguration, MeetingSessionCredentials,
  MessagingSessionConfiguration
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
  private stream1: any;
  private stream2: any;
  private stream3: any;
  private stream4: any;
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
  }
  localStream: MediaStream | undefined;
  ngOnChanges() {
    console.log("isAudio= " + this.isAudio)
    console.log("isVideo= " + this.isVideo)
  }

  async prepare() {
    const logger = new ConsoleLogger('SDK', LogLevel.INFO);
    const deviceController = new DefaultDeviceController(logger);

    let configuration = PreviewPageComponent.cofg

    const constraints: MediaStreamConstraints = {audio: this.isAudio, video: this.isVideo};
    this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log("configuration = "+JSON.stringify(configuration))
    if (PreviewPageComponent.attendeeId &&PreviewPageComponent.externalUserId && PreviewPageComponent.joinToken) {
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
      console.log(`Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`);
    });
    audioOutputDevices.forEach((mediaDeviceInfo: { deviceId: any; label: any; }) => {
      console.log(`Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`);
    });
    videoInputDevices.forEach((mediaDeviceInfo: { deviceId: any; label: any; }) => {
      console.log(`Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`);
    });
    const audioInputDeviceInfo = audioInputDevices[0];
    await this.meetingSession.audioVideo.startAudioInput(audioInputDeviceInfo.deviceId);

    const audioOutputDeviceInfo = audioOutputDevices[0];
    await this.meetingSession.audioVideo.chooseAudioOutput(audioOutputDeviceInfo.deviceId);

    const videoInputDeviceInfo = videoInputDevices[1];
    await this.meetingSession.audioVideo.startVideoInput(videoInputDeviceInfo.deviceId);

    const audioElement = document.getElementById('video-element-id');
    this.meetingSession.audioVideo.bindAudioElement(audioElement);

    this.meetingSession.audioVideo.start();
    console.log("end")
  }

  getAttendees() {
    return CallPageComponent.attendees
  }

  async onIsAudioChange($event: boolean) {
    this.isAudio = $event
    this.stream = await navigator.mediaDevices.getUserMedia({audio: this.isAudio, video: this.isVideo});
    CallPageComponent.attendees.map(it => {
      if (it.attendeeId === this.attendeeId) {
        it.stream.getAudioTracks()[0].enabled = this.isAudio
      }
    })
  }

  async onIsVideoChange($event: boolean) {
    this.isVideo = $event
    this.stream = await navigator.mediaDevices.getUserMedia({audio: this.isAudio, video: this.isVideo});
    CallPageComponent.attendees.map(it => {
      console.log("this.attendeeId = " + this.attendeeId)
      if (it.attendeeId === this.attendeeId) {
        it.stream.getVideoTracks()[0].enabled = this.isVideo
      }
    })
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
