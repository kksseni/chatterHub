import {Component, OnChanges, OnInit} from '@angular/core';

@Component({
  selector: 'app-call-page',
  templateUrl: './call-page.component.html',
  styleUrls: ['./call-page.component.css']
})
export class CallPageComponent implements OnInit, OnChanges {
  static attendees: { attendeeId: string; lname: string; fname: string; stream: MediaStream }[];
  private stream: any;
  private stream1: any;
  private stream2: any;
  private stream3: any;
  private stream4: any;
   isAudio: boolean = true;
   isVideo: boolean = true;
  constructor() {
  }

  ngOnInit(): void {
    this.prepare()
  }

  ngOnChanges(){
    console.log("isAudio= "+this.isAudio)
    console.log("isVideo= "+this.isVideo)
  }

  async prepare() {
    this.stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
    this.stream1 = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
    this.stream2 = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
    this.stream3 = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
    this.stream4 = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
    CallPageComponent.attendees = [
      {attendeeId: "id5",lname:"Sh", fname:"Kseniia", stream: this.stream },
      {attendeeId: "id4",lname:"Ann", fname:"Amm", stream: this.stream1 },
      {attendeeId: "id3",lname:"Ann", fname:"Amm", stream: this.stream2 },
      {attendeeId: "id2",lname:"Ann", fname:"Amm", stream: this.stream3 },
      {attendeeId: "id1",lname:"Ann", fname:"Amm", stream: this.stream4 }]
  }

  getAttendees() {
    return CallPageComponent.attendees
  }

  async onIsAudioChange($event: boolean) {
    this.isAudio = $event
    this.stream = await navigator.mediaDevices.getUserMedia({audio: this.isAudio, video: this.isVideo});
    CallPageComponent.attendees.map(it => {
      if (it.attendeeId === "id5") {
        it.stream.getAudioTracks()[0].enabled = this.isAudio
      }
    })
  }
  async onIsVideoChange($event: boolean) {
    this.isVideo = $event
    this.stream = await navigator.mediaDevices.getUserMedia({audio: this.isAudio, video: this.isVideo});
    CallPageComponent.attendees.map(it => {
      if (it.attendeeId === "id5"){
        it.stream.getVideoTracks()[0].enabled = this.isVideo
      }
    })
  }
}
