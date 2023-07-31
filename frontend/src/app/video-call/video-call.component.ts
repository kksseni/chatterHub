import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ChimeSDKMessagingClient} from '@aws-sdk/client-chime-sdk-messaging';
import {
  ConsoleLogger, DefaultDeviceController,
  DefaultMeetingSession,
  DefaultMessagingSession,
  LogLevel, MeetingSessionConfiguration,
  MessagingSessionConfiguration
} from "amazon-chime-sdk-js";
import {PreviewPageComponent} from "../meeting/preview-page/preview-page.component";

@Component({
  selector: 'app-video-conference',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css']
})
export class VideoConferenceComponent implements OnInit {
  // @ts-ignore
  meetingId: string; // This should be obtained from the backend API
  // @ts-ignore
  attendeeName: string; // This should be obtained from the backend API
  chime: any; // AWS Chime SDK instance
  meetingSession: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    // Fetch meeting details and attendee info from the backend API
    this.http.get<any>('YOUR_BACKEND_API_URL/meeting-info').subscribe((data) => {
      this.meetingId = data.meetingId;
      this.attendeeName = data.attendeeName;
    });

    this.initChime()
  }

  async initChime() {
    const logger = new ConsoleLogger('SDK', LogLevel.INFO);
    const deviceController = new DefaultDeviceController(logger);

    const configuration = PreviewPageComponent.cofg
    this.meetingSession = new DefaultMeetingSession(
      configuration,
      logger,
      deviceController
    );

    const audioInputDevices = await this.meetingSession.audioVideo.listAudioInputDevices();
    const audioOutputDevices = await this.meetingSession.audioVideo.listAudioOutputDevices();
    const videoInputDevices = await this.meetingSession.audioVideo.listVideoInputDevices();

    // An array of MediaDeviceInfo objects
    audioInputDevices.forEach((mediaDeviceInfo: { deviceId: any; label: any; }) => {
      console.log(`Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`);
    });
  }

  async initVideo() {
    const videoElement = document.getElementById('video-element-id');

    const videoInputDevices = await this.meetingSession.audioVideo.listVideoInputDevices();

    await this.meetingSession.audioVideo.startVideoInput(videoInputDevices[0].deviceId);

    const observer = {
      // videoTileDidUpdate is called whenever a new tile is created or tileState changes.
      videoTileDidUpdate: (tileState: { boundAttendeeId: any; localTile: any; tileId: any; }) => {
        // Ignore a tile without attendee ID and other attendee's tile.
        if (!tileState.boundAttendeeId || !tileState.localTile) {
          return;
        }

        this.meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoElement);
      }
    };

    this.meetingSession.audioVideo.addObserver(observer);

    this.meetingSession.audioVideo.startLocalVideoTile();
  }
}
