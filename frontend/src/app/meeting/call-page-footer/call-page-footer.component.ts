import { Component, OnInit , Input} from '@angular/core';
import { faVideo, faMicrophone, faPhone, faAngleUp, faClosedCaptioning, faDesktop, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-call-page-footer',
  templateUrl: `./call-page-footer.component.html`,
  styleUrls: ['./call-page-footer.component.css']
})
export class CallPageFooterComponent {
  @Input() isPresenting: boolean | undefined;
  @Input() isAudio: boolean | undefined;

  faVideo = faVideo;
  faMicrophone = faMicrophone;
  faPhone = faPhone;
  faAngleUp = faAngleUp;
  faClosedCaptioning = faClosedCaptioning;
  faDesktop = faDesktop;
  faMicrophoneSlash = faMicrophoneSlash;

  toggleAudio(isAudio: boolean) {
    // Implement your toggleAudio function logic here
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

