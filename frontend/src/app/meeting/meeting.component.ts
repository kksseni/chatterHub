import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MeetService} from "./meet.service";
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration,
  VideoTileState
} from "amazon-chime-sdk-js";
import {ActivatedRoute, Router} from "@angular/router";
import {CallPageComponent} from "./call-page/call-page.component";

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit {

  constructor(private meetService: MeetService, private route: ActivatedRoute, private router: Router) { }

  meetingId: string | undefined;
  resMeet: any;
  resAttendee: any;
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

  createMeeting() {
    return this.meetService.newMeet().toPromise().then((res) => {
      // @ts-ignore
      this.meetingId = res.meetingId;
      console.log(" this.meetingId =" + this.meetingId)
      this.resMeet = res;
    });
  }

  async joinMeeting() {
    CallPageComponent.attendeeId = this.attendeeId
    CallPageComponent.cofg = new MeetingSessionConfiguration(
      this.resMeet,
      this.resAttendee
    );
  }

  join() {
    console.log("meet ="+ this.meetingId)
    this.meetService.checkMeeting(this.meetingId).subscribe((res:any)=>{
      this.router.navigate([`/meets/${this.meetingId}`], { relativeTo: this.route });
    },
      ()=>{
        this.router.navigate([`/meetsgj`], { relativeTo: this.route });
      })
  }

  async newCall() {
    await this.createMeeting()
    this.createAttendee();
    await this.joinMeeting();
    await this.router.navigate([`/meets/${this.meetingId}`], {relativeTo: this.route});
  }

  private createAttendee() {
    this.meetService.newAttendee(this.meetingId).subscribe(async (res: Object) => {
      // @ts-ignore
      this.attendeeId = res.attendeeId;
      console.log("this.attendeeId =" +  this.attendeeId)
      this.resAttendee = res;
  })
  }
}
