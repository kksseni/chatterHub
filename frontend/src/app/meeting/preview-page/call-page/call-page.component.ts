import {Component, OnChanges, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MeetService} from "../../meet.service";

@Component({
  selector: 'app-call-page',
  templateUrl: './call-page.component.html',
  styleUrls: ['./call-page.component.css']
})
export class CallPageComponent implements OnInit, OnChanges {
  static attendees: { attendeeId: string; lname: string; fname: string; stream: MediaStream }[] = [];
  private stream: any;
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

  constructor(private meetService: MeetService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.prepare()
    this.attendeeId = <string>this.route.snapshot.paramMap.get('attendeeId');
    this.meetId = <string>this.route.snapshot.paramMap.get('id');
  }

  ngOnChanges() {
    console.log("isAudio= " + this.isAudio)
    console.log("isVideo= " + this.isVideo)
  }

  async prepare() {
    /* this.stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
     this.stream1 = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
     this.stream2 = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
     this.stream3 = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
     this.stream4 = await navigator.mediaDevices.getUserMedia({audio: true, video: true});

     CallPageComponent.attendees = [
       {attendeeId: "id5",lname:"Sh", fname:"Kseniia", stream: this.stream },
       {attendeeId: "id4",lname:"Ann", fname:"Amm", stream: this.stream1 },
       {attendeeId: "id3",lname:"Ann", fname:"Amm", stream: this.stream2 },
       {attendeeId: "id2",lname:"Ann", fname:"Amm", stream: this.stream3 },
       {attendeeId: "id1",lname:"Ann", fname:"Amm", stream: this.stream4 }]*/
  }

  getAttendees() {
    console.log(CallPageComponent.attendees)
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
