import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../domain/user";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MeetService {
  private apiServiceUrl ="http://localhost:8080/meeting";
  constructor(private http: HttpClient) { }

  public newMeet(): Observable<Object>{
    const formData = new FormData();
    return this.http.get<Object>(`${this.apiServiceUrl}/create`);
  }
  public newAttendee(meetingId: string | undefined): Observable<Object>{
    let name = this.create_UUID()
    console.log(name)
    const formData = new FormData();
    // @ts-ignore
    formData.append('userId', name);
    if(meetingId)
    formData.append('meetingId', meetingId);
    return this.http.post<Object>(`${this.apiServiceUrl}/join`, formData);
  }

  create_UUID(): string {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
  public deleteAttendee(meetingId: string | undefined, attendeeId: string | undefined): Observable<Object>{
    const formData = new FormData();
      // @ts-ignore
    formData.append('meetingId', meetingId);
      // @ts-ignore
    formData.append('attendeeId', attendeeId);
    console.log(`this.meetId = ${meetingId}, this.attendeeId = ${attendeeId}`)
    return this.http.post<Object>(`${this.apiServiceUrl}/delete`, formData);
  }

  checkMeeting(meetingId: string | undefined) : Observable<any>{
    const formData = new FormData();
    if(meetingId)
      formData.append('meetingId', meetingId);
    return this.http.post<any>(`${this.apiServiceUrl}/check`, formData);
  }
}
