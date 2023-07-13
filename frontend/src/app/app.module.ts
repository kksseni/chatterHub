import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {LoginService} from "./login/login.service";
import { MeetingComponent } from './meeting/meeting.component';
import {RouterModule, Routes} from "@angular/router";
import { ChatsComponent } from './chats/chats.component';

const appRoutes: Routes = [
  {path: '',redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'chats', component: ChatsComponent},
  {path: 'meets', component: MeetingComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MeetingComponent,
    ChatsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule {}
