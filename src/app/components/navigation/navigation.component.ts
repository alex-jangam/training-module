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
                       {name: "Courses", path: "/course"},
                       {name: "Sub Courses", path: "/sub-course", disabled : true},
                       {name: "Topics", path: "/topic", disabled : true}]
  constructor() { }

  ngOnInit() {
    this.navOptions = this.allOptions;
  }


}
