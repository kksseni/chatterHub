import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Clipboard, ClipboardModule} from "@angular/cdk/clipboard";
import {FormsModule} from "@angular/forms";
import {ClipboardService} from "ngx-clipboard";


@Component({
  selector: 'app-call-info-modal',
  templateUrl: './call-info-modal.component.html',
  styleUrls: ['./call-info-modal.component.css']
})
export class CallInfoModalComponent implements OnInit {
  // @ts-ignore
  meetId: string;
  // @ts-ignore
  link: string;

  constructor(private route: ActivatedRoute, private clipboard: Clipboard,private clipboardService: ClipboardService) {
  }

  ngOnInit(): void {
    this.meetId = <string>this.route.snapshot.paramMap.get('id');
    let fullLink = window.location.href
    this.link = fullLink.substring(0, fullLink.indexOf("/attendee/"))
  }

  text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
  copyContent() {
    this.clipboardService.copyFromContent(this.text);
  }

}
