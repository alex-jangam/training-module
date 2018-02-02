import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router';
import {MdDialog, MdDialogRef} from '@angular/material';
import {SubCoursesService} from 'app/services/sub-courses/sub-courses.service';
import {AddTopicComponent} from 'app/modals/add-topic/add-topic.component';
import {LocalstoreService} from 'app/services/localStore/localstore.service';
import * as config from 'app/services/config/config.service';

@Component({
  selector: 'app-sub-course',
  templateUrl: './sub-course.component.html',
  styleUrls: ['./sub-course.component.scss']
})
export class SubCourseComponent implements OnInit {
  courseId: any;
  tiles:any[] = [];
  isAdmin: any;
  isSuper: any;
  constructor(private router: Router, private route: ActivatedRoute, public dialog: MdDialog, private lStore: LocalstoreService, private http : SubCoursesService) { }

  ngOnInit() {
    let user = this.lStore.getItem("user");
    this.isSuper = (user.role === config.SA);
    this.route.params.subscribe(params => {
       this.courseId = params['id']; // (+) converts string 'id' to a number
       this.getCourses(params['id'])
    });
  }

  getCourses(id){
    this.http.getSubCourses(id).subscribe(res => this.listCourses(res))
  }

  listCourses(result){
    let resp = (result || {}), data = resp.data || {count: {}};
    this.tiles = resp.all || [];
    console.log(data)
    this.tiles.forEach((v,i) => {
      v.count = data.count[v.code] || 0;
    })
    this.isAdmin = (this.isSuper || (data.role == config.ADMIN));
  }

  openCourse(code:string){
    this.router.navigate(['/topic', code]);
  }

  addTopic(){
    let dialogRef = this.dialog.open(AddTopicComponent,{
      data: {course: this.courseId},
      width: '450px'});
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        result.created = new Date(result.created);
        this.tiles.push(result);
      }
    });
  }

  startTopic(topic){

  }
}
