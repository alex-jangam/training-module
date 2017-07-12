import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {LocalstoreService} from '../localStore/localstore.service'

import {User} from '../../classes/user';

@Injectable()
export class HttpService {
  accessHeader: any = {'Content-Type': 'application/json'};
  basicHeader: any = this.accessHeader;
  accessName = "x-access-token";
  base: string = "";
  STATUS_CODE_200 = 200;
  constructor(private http: Http, private ls: LocalstoreService) {
    if (!this.accessHeader.hasOwnProperty(this.accessName)) {
        let authT = {}, token = this.ls.getItem(this.accessName) || false;
        authT[this.accessName] = token;
        this.accessHeader = Object.assign(authT, this.accessHeader);
    }
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
    return this.http.get(url, this.getReqOptions(headers, params))
  }

  httpPost(url, body, headers, params){
    return this.http.post(url, body, this.getReqOptions(headers, params));
  }

  httpPut(url, body, headers, params){
    return this.http.put(url, body, this.getReqOptions(headers, params))
  }

  httpDel(url, body, headers, params){
    return this.http.delete(url, this.getReqOptions(headers, params))
  }

  processObj(res){
    let body = res.json();
		if (res.ok && res.status < 300) { // login successful
			return body;
		}
    return this.errorHandler(body);
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
  public setAccessHeaders(aToken:string){
    if(aToken)
      this.accessHeader[this.accessName] = aToken;
  }
  public token(user: User){
      return this.httpPost(this.base + "/users/token", user, this.basicHeader, {});
  }

  public getCategories(){
      return this.httpGet(this.base + "/category", this.accessHeader, {});
  }

  public addCategory(cat: object){
      return this.httpPost(this.base + "/category", cat, this.accessHeader, {});
  }

  public getCourses(){
      return this.httpGet(this.base + "/course", this.accessHeader, {});
  }

}
