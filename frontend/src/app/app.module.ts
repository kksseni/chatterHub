import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {LoginService} from "./login/login.service";
import { MeetingComponent } from './meeting/meeting.component';
import {RouterModule, Routes} from "@angular/router";
import { ChatsComponent } from './chats/chats.component';
import { CallPageHeaderComponent } from './meeting/preview-page/call-page-header/call-page-header.component';
import { CallPageFooterComponent } from './meeting/preview-page/call-page-footer/call-page-footer.component';
import { CallPageComponent } from './meeting/preview-page/call-page/call-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { PreviewPageComponent } from './meeting/preview-page/preview-page.component';

const appRoutes: Routes = [
  {path: '',redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'meets/:id', component: PreviewPageComponent},
  {path: 'meets/:id/attendee/:attendeeId', component: CallPageComponent},
  {path: 'chats', component: ChatsComponent},
  {path: 'meets', component: MeetingComponent},
  {path: '**', pathMatch: 'full', component: NotFoundPageComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MeetingComponent,
    ChatsComponent,
    CallPageHeaderComponent,
    CallPageFooterComponent,
    CallPageComponent,
    NotFoundPageComponent,
    PreviewPageComponent
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        ReactiveFormsModule,
        FormsModule
    ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule {}
