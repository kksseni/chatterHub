import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Login} from "../domain/login";
import {User} from "../domain/user";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiServiceUrl ="http://localhost:8080";
  constructor(private http: HttpClient) { }

  public login(profile: Login): Observable<User>{
    return this.http.post<User>(`${this.apiServiceUrl}/login`, profile);
  }
}
