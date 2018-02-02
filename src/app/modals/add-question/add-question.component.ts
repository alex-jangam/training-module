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
  guides: any[] = [""];
  snippets : string[] = [""];
  constructor(private http:QuestionsService, public dialogRef: MdDialogRef<AddQuestionComponent>, @Inject(MD_DIALOG_DATA) public data: any) {
  }
  ngOnInit() {
    // new Question(question,topic,course,code,priority,guides,snippets)
    this.question = new Question("",this.data.topic,this.data.course,null,0,[],[]);
  }

  addSnippet(){
    this.snippets.push("");
  }
  removeSnippet(i){
    this.snippets.splice(i, 1)
  }
  addGuide(){
    this.guides.push("");
  }

  removeGuide(i){
    this.guides.splice(i, 1);
  }

  save(){
      let empty = "", guides = this.guides.slice(), snippets = this.snippets.slice(), priority = 0, code = null, course = null, topic = null, question = null;
      if(guides.slice(-1)[0] == empty) {
        guides.pop();
      }
      if(snippets.slice(-1)[0] == empty) {
        snippets.pop()
      }
      this.question.snippets = snippets;
      this.question.guides = guides;
      this.http.addQuestion(this.question).subscribe(res => this.closeDialog(res), er => this.errorMsg(er))
  }

  closeDialog(data){
    this.dialogRef.close(data);
  }

  errorMsg(er){

  }

  trackByIndex(index: any, item: any){
    return index;
  }
}
