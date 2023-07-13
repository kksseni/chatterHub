import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = request.clone({
      withCredentials: true,
    });

      if (!localStorage.getItem("access_token")) {
        authReq = request.clone({
          headers: request.headers.set('Authorization', 'Bearer ' + localStorage.getItem("access_token")),
        })
      }

    return next.handle(authReq);
  }
}
