import { Component, OnInit } from '@angular/core';
import {User} from 'app/classes/user';
import {HttpService } from 'app/services/http/http.service'
import {Response } from '@angular/http';
import {Router } from '@angular/router';
import {LocalstoreService} from 'app/services/localStore/localstore.service';
import {LoginChangeinService} from 'app/services/login/login.service';
import * as config from 'app/services/config/config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginInfo : any = {}
  accessName = "x-access-token";
  remember = false;
  constructor(private router: Router,private httpService : HttpService, private ls : LocalstoreService, private loginchange: LoginChangeinService) { }

  ngOnInit() {
    this.remember = this.ls.getItem("remember") || false;
    if(this.remember){
       this.loginInfo = this.remember;
    }
  }

  login(loginInfo: User){
    this.httpService.token(loginInfo).subscribe(res => this.loginSuccess(res), err => this.loginFailed(err));
  }

  loginSuccess(response: any){
    this.ls.saveItem("remember", this.loginInfo);
    this.ls.saveItem("user", response.user);
    this.ls.saveItem(this.accessName, response.token);
    this.loginchange.triggerLogin();
    let path = '/dashboard';
    this.router.navigateByUrl(path);
  }

  private loginFailed (error: Response | any) {
    this.ls.removeItem("remember")
    console.log("Error", error)
  }
}
