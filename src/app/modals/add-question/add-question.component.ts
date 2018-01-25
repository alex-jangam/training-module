import { Component, OnInit, Inject } from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import {QuestionsService} from 'app/services/questions/questions.service'
import {Question} from 'app/classes/question';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {

  question:any;
  course: any;
  topic: any;
  guides: any[] = [];
  snippets : string[] = [];
  constructor(private http:QuestionsService, public dialogRef: MdDialogRef<AddQuestionComponent>, @Inject(MD_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.question = new Question();
    console.log(this.question)
  }

  addSnippet(){
    this.snippets.push("");
  }
  addGuide(){
    this.guides.push("");
  }

  trackByIndex(index: any, item: any){
    return index;
  }
}
