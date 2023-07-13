import { Component, OnInit } from '@angular/core';
import {MeetService} from "./meet.service";
/*import * as ChimeSDK from 'aws-sdk';
import {ChimeSDKMeetings} from "aws-sdk";*/
@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit {

  constructor(private meetService: MeetService) { }

  ngOnInit(): void {
  }

  startMeet() {
    let name = localStorage.getItem("name")
    this.meetService.startMeet(name).subscribe((res:Object)=>{
      console.log("res =" + res)
      //const configuration = new ChimeSDK.ChimeSDKMeetings();
    })

  }
}
