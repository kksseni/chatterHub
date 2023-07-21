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
    let name = localStorage.getItem("name")
    const formData = new FormData();
    // @ts-ignore
    formData.append('userId', name);
    if(meetingId)
    formData.append('meetingId', meetingId);
    return this.http.post<Object>(`${this.apiServiceUrl}/join`, formData);
  }

  checkMeeting(meetingId: string | undefined) : Observable<any>{
    const formData = new FormData();
    if(meetingId)
      formData.append('meetingId', meetingId);
    return this.http.post<any>(`${this.apiServiceUrl}/check`, formData);
  }
}
