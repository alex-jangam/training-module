import { Component, OnInit, Inject } from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import {SubCoursesService} from 'app/services/sub-courses/sub-courses.service'

@Component({
  selector: 'app-add-topic',
  templateUrl: './add-topic.component.html',
  styleUrls: ['./add-topic.component.scss']
})
export class AddTopicComponent implements OnInit {

  topic: string;
  course: string;
  error: string;
  constructor(private http:SubCoursesService,public dialogRef: MdDialogRef<AddTopicComponent>, @Inject(MD_DIALOG_DATA) public data: any) {
    this.course = this.data.course;
  }
  ngOnInit() {
  }

  save(){
    console.log(this.course)
    this.http.addTopic(this.topic, this.course).subscribe(res => this.saved(res),er => this.errorHandler(er))
  }

  saved(res){
    this.dialogRef.close(res);
  }

  errorHandler(er){
    this.error = er.message
  }
}
