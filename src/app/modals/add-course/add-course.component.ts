import { Component, OnInit, Inject } from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import {CoursesService} from 'app/services/courses/courses.service'


@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {
  course:string = "";
  category:string = "";
  error;
  constructor(public http:CoursesService,public dialogRef: MdDialogRef<AddCourseComponent>, @Inject(MD_DIALOG_DATA) public data: any) {
    this.category = this.data.category;
  }

  ngOnInit() {
  }

  save(){
    this.http.addCourse(this.course, this.category)
    .subscribe(
      res => this.saved(res),
      er => this.errorHandler(er)
    );
  }

  saved(res){
    this.dialogRef.close(res);
  }

  errorHandler(er){
    console.log(er)
    this.error = er.message
  }
}
