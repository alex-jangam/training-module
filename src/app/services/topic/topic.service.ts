import { Injectable } from '@angular/core';
import { HttpService } from 'app/services/http/http.service';
import { Headers, Http } from '@angular/http';
import {LocalstoreService} from 'app/services/localStore/localstore.service';
import { Router } from '@angular/router';
import { OverlayService } from "app/services/overlay/overlay.service";
import { LoginChangeinService } from 'app/services/login/login.service';

@Injectable()
export class TopicService extends HttpService{

  constructor(public http: Http, public ls: LocalstoreService, public router: Router, public overlay: OverlayService, public loginchange: LoginChangeinService) {
    super(http, ls, router, overlay, loginchange);
  }

  public getQuestions(topic){
      return this.httpGet(this.base + "/questions", this.accessHeader, {topic: topic});
  }

}
