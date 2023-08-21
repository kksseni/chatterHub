import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Login} from "../domain/login";
import {User} from "../domain/user";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiServiceUrl ="https://d1fn4jog1mxuxv.cloudfront.net";
  constructor(private http: HttpClient) {
    if (window.location.href.startsWith("http://localhost:4200")){
      this.apiServiceUrl = "http://localhost:8080";
    }
  }

  public login(profile: Login): Observable<User>{
    return this.http.post<User>(`${this.apiServiceUrl}/login`, profile);
  }
}
