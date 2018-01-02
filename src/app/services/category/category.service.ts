import { Injectable } from '@angular/core';
import { HttpService } from 'app/services/http/http.service';
import { Headers, Http } from '@angular/http';
import {LocalstoreService} from '../localStore/localstore.service';
import { Router } from '@angular/router';
import { OverlayService } from "app/services/overlay/overlay.service";
import {LoginChangeinService} from 'app/services/login/login.service';

@Injectable()
export class CategoryService  extends HttpService{

  constructor(public http: Http, public ls: LocalstoreService, public router: Router, public overlay: OverlayService, public loginchange: LoginChangeinService) {
    super(http, ls, router, overlay, loginchange);
  }
  public getCategories(){
      return this.httpGet(this.base + "/category", this.accessHeader, {});
  }

  public addCategory(cat: object){
      return this.httpPost(this.base + "/category", cat, this.accessHeader, {});
  }

  public approveCatogory(cat){
    return this.httpPut(this.base + "/category/approve", cat, this.accessHeader, {});
  }
}
