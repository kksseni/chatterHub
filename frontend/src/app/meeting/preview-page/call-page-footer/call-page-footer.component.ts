import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { faVideo, faMicrophone, faPhone, faAngleUp, faClosedCaptioning, faDesktop, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-call-page-footer',
  templateUrl: `./call-page-footer.component.html`,
  styleUrls: ['./call-page-footer.component.css']
})
export class CallPageFooterComponent {
  @Input() isPresenting: boolean | undefined;
  @Input() isAudio: boolean | undefined;
  @Input() isVideo: boolean | undefined;
  @Output() isAudioChange = new EventEmitter<boolean>();
  @Output() isVideoChange = new EventEmitter<boolean>();

  faVideo = faVideo;
  faMicrophone = faMicrophone;
  faPhone = faPhone;
  faAngleUp = faAngleUp;
  faClosedCaptioning = faClosedCaptioning;
  faDesktop = faDesktop;
  faMicrophoneSlash = faMicrophoneSlash;

  toggleAudio() {
   this.isAudio = !this.isAudio
    this.isAudioChange.emit(this.isAudio);
  }
  toggleVideo() {
    this.isVideo = !this.isVideo
    this.isVideoChange.emit(this.isVideo);
  }

  disconnectCall() {
    // Implement your disconnectCall function logic here
  }

  stopScreenShare() {
    // Implement your stopScreenShare function logic here
  }

  screenShare() {
    // Implement your screenShare function logic here
  }
}

