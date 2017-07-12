import { Component, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import {HttpService} from '../../services/http/http.service'

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  category: string;
  error: string;
  constructor(private http:HttpService,public dialogRef: MdDialogRef<AddCategoryComponent>) {}
  ngOnInit() {
  }

  save(){
    this.http.addCategory({name :this.category}).subscribe(res => this.saved(res.json()),er => this.errorHandler(er.json()))
  }

  saved(res){
    this.dialogRef.close(res);
  }

  errorHandler(er){
    console.log(er)
    this.error = er.message
  }
}
