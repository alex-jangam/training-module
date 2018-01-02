import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {HttpService} from './services/http/http.service';
import {environment} from '../environments/environment';
@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss','./shared/common.scss']
})

export class AppComponent implements OnInit{
  title = 'app';
  constructor(private https: HttpService){
  }
  ngOnInit() {

  }
}
