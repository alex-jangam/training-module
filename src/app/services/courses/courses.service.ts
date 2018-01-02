import { Injectable } from '@angular/core';
import { HttpService } from 'app/services/http/http.service';
import { Headers, Http } from '@angular/http';
import {LocalstoreService} from 'app/services/localStore/localstore.service';
import { Router } from '@angular/router';
import {LoginChangeinService} from 'app/services/login/login.service';
import { OverlayService } from "app/services/overlay/overlay.service";

@Injectable()
export class CoursesService  extends HttpService{

  constructor(public http: Http, public ls: LocalstoreService, public router: Router, public overlay: OverlayService, public loginchange: LoginChangeinService) {
    super(http, ls, router, overlay, loginchange);
  }

  public getCourses(cat){
      return this.httpGet(this.base + "/courses", this.accessHeader, {category: cat});
  }

  public getAllCourses(){
    return this.httpGet(this.base + "/courses/all", this.accessHeader, {});
  }

  public addCourse(name, category){
    return this.httpPost(this.base + "/courses", {category : category,name: name}, this.accessHeader, {});
  }

  public approveCourse(user, code){
    return this.httpPut(this.base + "/courses/approve", {user: user, course : code}, this.accessHeader, {});
  }
}
