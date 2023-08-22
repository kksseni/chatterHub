import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.css']
})
export class SettingsModalComponent implements OnInit {
  // @ts-ignore
  micros: MediaDeviceInfo[];
  // @ts-ignore
  headphones: MediaDeviceInfo[];
  // @ts-ignore
  videos: MediaDeviceInfo[] | null;
  videoDeviceId: string | undefined;
  audioInputDeviceId: string | undefined;
  audioOutputDeviceId: string | undefined;
  isAudio: boolean;
  isVideo: boolean;

  constructor() {
    this.isAudio = true;
    this.isVideo = true;
  }

  ngOnInit(): void {
    this.initDevices();
    this.initSettings();
  }

  private async initDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.videos = devices.filter(device => device.kind === 'videoinput');
    this.micros = devices.filter(device => device.kind === 'audioinput');
    this.headphones = devices.filter(device => device.kind === 'audiooutput');
  }

  private async initSettings() {
    let mediaStream = await navigator.mediaDevices.getUserMedia({audio: this.isAudio, video: this.isVideo});
    this.videoDeviceId =   localStorage.getItem("videoInputDevice") || mediaStream.getVideoTracks()[0].label
    this.audioInputDeviceId = localStorage.getItem("audioInputDevice") || mediaStream.getAudioTracks()[0].label
  }

  selectHeadphones(deviceId: string) {
    localStorage.removeItem("audioOutputDevice");
    localStorage.setItem("audioOutputDevice", deviceId);
  }

  selectMicro(deviceId: string) {
    localStorage.removeItem("audioInputDevice");
    localStorage.setItem("audioInputDevice", deviceId);
  }

  selectCamera(deviceId: string) {
    localStorage.removeItem("videoInputDevice");
    localStorage.setItem("videoInputDevice", deviceId);
    console.log("deviceId = "+ deviceId)
    this.videoDeviceId = deviceId
    window.location.reload()
  }

}
