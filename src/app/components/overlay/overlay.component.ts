import { Component, OnInit } from '@angular/core';
import {OverlayService} from 'app/services/overlay/overlay.service'

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent implements OnInit {
  showOverlay:boolean = false;
  constructor(private overlay: OverlayService) {
    let sub = this.overlay.overlayObs$.subscribe(val => this.setView(val))
  }
  ngOnInit() {
  }
  setView(view){
    setTimeout(() => {
      this.showOverlay = view;
    }, 0)
  }
}
