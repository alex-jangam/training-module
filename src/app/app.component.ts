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
    let baseUrl = "";
    switch(environment.name){
      case "local":
      baseUrl = "http://localhost:4000";
      break;
      case "dev":break;
      case "prod":break;
    }
    this.https.setBase(baseUrl);
  }
}
