import { Component, OnInit, ViewChild } from '@angular/core';
import {MdSidenav} from '@angular/material';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  login = '/login';
  navOptions: any[];
  allOptions: any[] = [{name: "Dashboard", path: "/dashboard"},
                       {name: "Courses", path: "/course/all"},
                       {name: "Sub Courses", path: "/sub-course/all"},
                       {name: "Topics", path: "/topic"}]
  constructor() { }

  ngOnInit() {
    this.navOptions = this.allOptions;
  }


}
