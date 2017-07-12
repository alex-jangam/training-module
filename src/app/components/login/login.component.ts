import { Component, OnInit } from '@angular/core';
import {User} from '../../classes/user';
import {HttpService } from '../../services/http/http.service'
import {Response } from '@angular/http';
import {Router } from '@angular/router';
import {LocalstoreService} from '../../services/localStore/localstore.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginInfo : any = {}
  accessName = "x-access-token";
  remember = false;
  constructor(private router: Router,private httpService : HttpService, private ls : LocalstoreService) { }

  ngOnInit() {
    this.remember = this.ls.getItem("remember") || false;
    if(this.remember){
       this.loginInfo = this.remember;
    }
  }

  login(loginInfo: User){
    this.httpService.token(loginInfo).subscribe(res => this.loginSuccess(res.json()), err => this.loginFailed(err));
  }

  loginSuccess(response: any){
    this.ls.saveItem("remember", this.loginInfo);
    this.ls.saveItem(this.accessName, response.token);
    this.ls.saveItem("user", response.user);
    this.httpService.setAccessHeaders(response.token);
    let path = '/dashboard';
    this.router.navigateByUrl(path);
  }

  private loginFailed (error: Response | any) {
    this.ls.removeItem("remember")
    console.log("Error", error)
  }
}
