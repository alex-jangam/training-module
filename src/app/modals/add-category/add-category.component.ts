import { Component, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import {CategoryService} from 'app/services/category/category.service'

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  category: string;
  error: string;
  constructor(private http:CategoryService,public dialogRef: MdDialogRef<AddCategoryComponent>) {}
  ngOnInit() {
  }

  save(){
    this.http.addCategory({name :this.category}).subscribe(res => this.saved(res),er => this.errorHandler(er))
  }

  saved(res){
    this.dialogRef.close(res);
  }

  errorHandler(er){
    this.error = er.message
  }
}
