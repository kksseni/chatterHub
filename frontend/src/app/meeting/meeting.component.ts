import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MeetService} from "./meet.service";
import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";
import {
  useMeetingManager,
  useMeetingEvent,
  useAudioVideo,
  useLocalVideo,
  ControlBar,
  ControlBarButton,
  Remove,
  Meeting,
  LeaveMeeting,
  AudioInputControl,
  DeviceLabels,
  VideoInputControl,
  AudioOutputControl,
  MeetingStatus,
  RemoteVideos,
  Input,
  useMeetingStatus,
  LocalVideo
} from "amazon-chime-sdk-component-library-react";
/*import * as ChimeSDK from 'aws-sdk';
import {ChimeSDKMeetings} from "aws-sdk";*/
@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit {
  @ViewChild('videoElement') elementRef: ElementRef | undefined;
  constructor(private meetService: MeetService) { }
  //_streamManager: StreamManager;
  ngOnInit(): void {
  }
  ngAfterViewInit() {
    //this._streamManager.addVideoElement(this.elementRef.nativeElement);
  }

  startMeet() {
    let name = localStorage.getItem("name")
    this.meetService.startMeet(name).subscribe((res:Object)=>{
      // @ts-ignore
      console.log("res =" +  JSON.stringify(res))
      const result = JSON.stringify(res);

      // @ts-ignore
      const meetingSessionConfiguration = new MeetingSessionConfiguration(
        // @ts-ignore
        result.data.Meeting,
        // @ts-ignore
        result.data.Attendee
      );
      const meetingOptions = {
        deviceLabels: DeviceLabels.AudioAndVideo
      };
      
    })

  }
}
