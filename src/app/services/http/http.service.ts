import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {LocalstoreService} from 'app/services/localStore/localstore.service';

import {User} from 'app/classes/user';
import {environment} from '../../../environments/environment';
import * as config from 'app/services/config/config.service';
import {LoginChangeinService} from 'app/services/login/login.service';
import { OverlayService } from "app/services/overlay/overlay.service";
import { Router } from '@angular/router';


@Injectable()
export class HttpService {
  accessHeader: any = {'Content-Type': 'application/json'};
  basicHeader: any = this.accessHeader;
  accessName = "x-access-token";
  public base: string = "";
  STATUS_CODE_200 = 200;
  constructor(public http: Http, public ls: LocalstoreService, public router: Router, public overlay: OverlayService, public loginchange: LoginChangeinService) {
    if (!this.accessHeader.hasOwnProperty(this.accessName)) {
        let authT = {}, token = this.ls.getItem(this.accessName) || false;
        authT[this.accessName] = token;
        this.accessHeader = Object.assign(authT, this.accessHeader);
    }
    this.checkbase();
    this.loginchange.lookfor.subscribe((val) => this.resetAccessHeaders())
  }

  checkbase() {
    let baseUrl = "";
    switch(environment.name){
      case "local":
      baseUrl = "http://localhost:4000";
      break;
      case "dev":break;
      case "prod":break;
    }
    this.setBase(baseUrl);
  }

  getReqOptions(headers: any, params?: Object){
    let nHead = {headers: new Headers(headers)},searhP = new URLSearchParams();
    if(params){
      for( let i in params){
        searhP.append(i, params[i]);
      }
    }
    return new RequestOptions({headers: new Headers(headers), search : searhP})
  }

  httpGet(url: string, headers: Object, params?: Object){
    let ser = this.servStart();
    return new Observable((observer) => {
        this.http.get(url, this.getReqOptions(headers, params))
        .subscribe(
          (data) => {
            this.servEnd(ser);
            observer.next(data.json());
            observer.complete();
          }, (err) => {
            this.servEnd(ser);
            let erMsg = (err.json() || {}).message;
            if(erMsg == config.sessionExpire || erMsg === config.expireToken) {
              this.router.navigateByUrl(config.loginPath)
            }
            observer.error(err.json());
            observer.complete();
          })
        });
  }

  httpPost(url, body, headers, params){
    let ser = this.servStart();
    return new Observable((observer) => {
        this.http.post(url, body, this.getReqOptions(headers, params))
        .subscribe(
          (data) => {
            this.servEnd(ser);
            observer.next(data.json());
            observer.complete();
          }, (err) => {
            this.servEnd(ser);
            let erMsg = (err.json() || {}).message;
            if(erMsg == config.sessionExpire || erMsg === config.expireToken) {
              this.router.navigateByUrl(config.loginPath)
            }
            observer.error(err.json());
            observer.complete();
          })
        });
  }

  httpPut(url, body, headers, params){
    let ser = this.servStart();
    return new Observable((observer) => {
        this.http.put(url, body, this.getReqOptions(headers, params))
        .subscribe(
          (data) => {
            this.servEnd(ser);
            observer.next(data.json());
            observer.complete();
          }, (err) => {
            this.servEnd(ser);
            let erMsg = (err.json() || {}).message;
            if(erMsg == config.sessionExpire || erMsg === config.expireToken) {
              this.router.navigateByUrl(config.loginPath)
            }
            observer.error(err.json());
            observer.complete();
          })
        });
  }

  httpDel(url, body, headers, params){
    let ser = this.servStart();
    return new Observable((observer) => {
        this.http.delete(url, this.getReqOptions(headers, params))
        .subscribe(
          (data) => {
            this.servEnd(ser);
            observer.next(data.json());
            observer.complete();
          }, (err) => {
            this.servEnd(ser);
            let erMsg = (err.json() || {}).message;
            if(erMsg == config.sessionExpire || erMsg === config.expireToken) {
              this.router.navigateByUrl(config.loginPath)
            }
            observer.error(err.json());
            observer.complete();
          })
        });
  }

  processObj(res){
    let body = res.json();
		if (res.ok && res.status < 300) { // login successful
			return body;
		}
    return this.errorHandler(body);
  }

  servStart() {
    let nos = this.overlay.openLayer(true);
    return nos;
  }
  servEnd(ob) {
    this.overlay.openLayer(false, ob);
  }


  errorHandler(error){
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }

  public setBase(nbase:string){
    this.base = nbase;
  }

  public resetAccessHeaders() {
    setTimeout(() => {
      this.accessHeader[this.accessName] = this.ls.getItem(this.accessName);
    }, 100)
  }
  public token(user: User){
      return this.httpPost(this.base + "/users/token", user, this.basicHeader, {});
  }

}
