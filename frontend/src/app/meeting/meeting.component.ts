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
import {CallPageComponent} from "./preview-page/call-page/call-page.component";
import {PreviewPageComponent} from "./preview-page/preview-page.component";

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit {

  constructor(private meetService: MeetService, private route: ActivatedRoute, private router: Router) { }

  meetingId: string | undefined;
  resMeet: any;
  name: string | undefined;
  localStream: MediaStream | undefined;
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
    await this.router.navigate([`/meets/${this.meetingId}`], {relativeTo: this.route});
  }
}
