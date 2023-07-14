import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MeetService} from "./meet.service";
import {
  AudioVideoObserver,
  ConsoleLogger, DefaultDeviceController, DefaultMeetingSession, LogLevel,
  MeetingSessionConfiguration,
  MeetingSessionStatus,
  MeetingSessionStatusCode, VideoTileState
} from "amazon-chime-sdk-js";
@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit {
  // @ts-ignore
  @ViewChild('videoElement') videoElement: ElementRef;
  // @ts-ignore
  @ViewChild('remoteVideoElement') remoteVideoElement: ElementRef;
  constructor(private meetService: MeetService) { }

  meetingId: string | undefined;
  res: any;
  attendeeId: string | undefined;
  name: string | undefined;
  localStream: MediaStream | undefined;
  attendees: { attendeeId: string; stream: MediaStream }[] = [];
  //_streamManager: StreamManager;
  ngOnInit(): void {
  }
  ngAfterViewInit() {
    //this._streamManager.addVideoElement(this.elementRef.nativeElement);
  }

  startMeet() {
    let name = localStorage.getItem("name")
    this.meetService.startMeet(name).subscribe(async (res: Object) => {
      // @ts-ignore
      console.log("res =" + JSON.stringify(res))
    })
  }

  async createMeeting() {
    let name = localStorage.getItem("name")
    this.meetService.startMeet(name).subscribe(async (res: Object) => {
      // @ts-ignore
      console.log("res =" + JSON.stringify(res))
      // @ts-ignore
      this.meetingId = res.meeting.meetingId;
      console.log(" this.meetingId =" +  this.meetingId)
      // @ts-ignore
      this.attendeeId = res.attendee.attendeeId;
      console.log("this.attendeeId =" +  this.attendeeId)
      this.res = res;
    })

  }

  async joinMeeting() {
    this.name = this.name || 'Guest';

    // Obtain media stream from the user's webcam
    const constraints: MediaStreamConstraints = { audio: true, video: true };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.localStream = stream;

    // Add the local stream to the attendee's list
    if (this.attendeeId)
    this.attendees.push({ attendeeId: this.attendeeId, stream: this.localStream });

    // Connect to the Chime meeting
    const audioVideoElement = this.videoElement.nativeElement;

    const logger = new ConsoleLogger('ChimeMeeting', LogLevel.INFO);
    const deviceController = new DefaultDeviceController(logger);
    const configuration = new MeetingSessionConfiguration(
      this.res.meeting,
      this.res.attendee
    );
    const meetingSession = new DefaultMeetingSession(configuration, logger, deviceController);

    meetingSession.audioVideo.start();
    meetingSession.audioVideo.addObserver({
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
              meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoElement);
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
}
