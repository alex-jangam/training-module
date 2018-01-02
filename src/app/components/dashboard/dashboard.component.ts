import { Component, OnInit } from '@angular/core';
import {CategoryService} from 'app/services/category/category.service';
import {UtilsService} from 'app/services/utils/utils.service';
import {MdDialog, MdDialogRef} from '@angular/material';
import {AddCategoryComponent} from 'app/modals/add-category/add-category.component';
import {LocalstoreService} from 'app/services/localStore/localstore.service';
import * as config from 'app/services/config/config.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  tiles : any[];
  isSuper: boolean = false;
  isAdmin: boolean = false;
  onapprove:boolean = false;
  constructor(private router: Router,private http : CategoryService, private utils: UtilsService, public dialog: MdDialog, private ls:LocalstoreService) {

  }

  ngOnInit() {
    this.getCatogories();
    let user = this.ls.getItem("user");
    this.isSuper = (user.role === config.SA);
    this.isAdmin = (user.role === config.ADMIN);
  }

  getCatogories(){
      this.http.getCategories().subscribe(resp => this.catogorySuccess(resp));
  }

  catogorySuccess(resp){
    let cats = resp.all;
    cats.forEach(c => {
      c.created = new Date(c.created)
    })
    this.tiles = resp.all;
  }

  openCourse(code:string){
    setTimeout(() => {
      if(!this.onapprove) {
        this.router.navigate(['/course', code]);
      }
    }, 10)
  }

  addCategory(){
    let dialogRef = this.dialog.open(AddCategoryComponent,{
      width: '450px'});
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        result.created = new Date(result.created);
        this.tiles.push(result);
      }
    });
  }

  categoryApprove(catogory){
    this.onapprove = true;
    this.http.approveCatogory(catogory).subscribe((res:any) =>{
      let resp = res || {};
      catogory.approved = resp.approved;
      this.onapprove = false;
    });
  }
}
