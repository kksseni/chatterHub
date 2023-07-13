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

  public startMeet(name: string | null): Observable<Object>{
    const formData = new FormData();
    // @ts-ignore
    formData.append('userId', name);
    return this.http.post<Object>(`${this.apiServiceUrl}/join`, formData);
  }
}
