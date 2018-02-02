import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router';
import {MdDialog, MdDialogRef} from '@angular/material';
import {TopicService} from 'app/services/topic/topic.service';
import {AddQuestionComponent} from 'app/modals/add-question/add-question.component';
import {LocalstoreService} from 'app/services/localStore/localstore.service';
import * as config from 'app/services/config/config.service';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {
  topicId : string;
  courseId: any;
  tiles:any[] = [];
  questions:any[] = [];
  question:any;
  isAdmin: any;
  isSuper: any;
  qIndex:number = 0;
  answers:any = {};

  constructor(private router: Router, private route: ActivatedRoute, public dialog: MdDialog, private lStore: LocalstoreService, private http : TopicService) { }

  ngOnInit() {
    let user = this.lStore.getItem("user");
    this.isSuper = (user.role === config.SA);
    this.route.params.subscribe(params => {
       this.topicId = params['id']; // (+) converts string 'id' to a number
       this.getQuestions(params['id']);
      //  this.getAnswers(params['id']);
    });
  }

  getQuestions(topicId){
    this.http.getQuestions(topicId).subscribe(res => this.loadQuestions(res));
  }

  loadQuestions(result){
    this.isAdmin = (this.isSuper || (result.data && result.data.role == config.ADMIN));
    this.questions = result.all;
    this.courseId = result.data.course;
  }

  selecteQ(q, i){
    this.question = q;
    this.qIndex = i+1;
  }

  addQuestion(){
    let dialogRef = this.dialog.open(AddQuestionComponent,{
      data: {course: this.courseId, topic : this.topicId},
      width: '800px'});
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        result.created = new Date(result.created);
        this.questions.push(result);
      }
    });
  }
}
