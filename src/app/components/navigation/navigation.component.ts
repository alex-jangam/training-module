import { Component, OnInit, ViewChild } from '@angular/core';
import {MdSidenav} from '@angular/material';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  login = '/login';
  navOptions: any[];
  allOptions: any[] = [{name: "Dashboard", path: "/dashboard"},
                       {name: "Courses", path: "/course"},
                       {name: "Sub Courses", path: "/sub-course"},
                       {name: "Topics", path: "/topic"}]
  constructor() { }

  ngOnInit() {
    this.navOptions = this.allOptions;
  }


}
