import { Component, OnInit } from '@angular/core';
import {HttpService} from '../../services/http/http.service'
import {UtilsService} from '../../services/utils/utils.service'
import {MdDialog, MdDialogRef} from '@angular/material';
import {AddCategoryComponent} from '../../modals/add-category/add-category.component'
import {Router} from '@angular/router'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  tiles : any[];

  constructor(private router: Router,private http : HttpService, private utils: UtilsService, public dialog: MdDialog) {

  }

  ngOnInit() {
    this.getCatogories()
  }

  getCatogories(){
      this.http.getCategories().subscribe(resp => this.catogorySuccess(resp.json()))
  }

  catogorySuccess(resp){
    let cats = resp.all;
    cats.forEach(c => {
      c.created = new Date(c.created)
    })
    this.tiles = resp.all;
  }

  openCourse(code:string){
    this.router.navigate(['/course', code]);
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

}
