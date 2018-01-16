import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {

  constructor(private router: Router) { }
  redirectPaths: any = {
    "/course" : "/course/all"
  }
  ngOnInit() {
    let baseurl = this.router.url, newPath = this.redirectPaths[baseurl];
    this.router.navigateByUrl(newPath);
  }

}
