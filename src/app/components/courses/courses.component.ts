import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router';
import {MdDialog, MdDialogRef} from '@angular/material';
import {CoursesService} from 'app/services/courses/courses.service';
import {LocalstoreService} from 'app/services/localStore/localstore.service';
import * as config from 'app/services/config/config.service';
import {AddCourseComponent} from 'app/modals/add-course/add-course.component';


@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  tiles:any[] = [];
  hasCategory = false;
  category:string = "";
  showAddCourse = false;
  isSuper: boolean = false;
  onapprove:boolean = false;
  constructor(private router: Router, private route: ActivatedRoute,private http : CoursesService, public dialog: MdDialog, private lStore: LocalstoreService) { }

  ngOnInit() {
    let user = this.lStore.getItem("user");
    this.isSuper = (user.role === config.SA);

    this.route.params.subscribe(params => {
       if(params['category'] === config.all) {
         this.hasCategory = false;
         this.getAllCourses();
       } else {
         this.hasCategory = true;
         this.category = params['category'];
         this.getCourses(params['category'])
       }
    });
  }

  getCourses(id){
    this.http.getCourses(id).subscribe(res => this.listCourses(res))
  }

  getAllCourses(){
    this.http.getAllCourses().subscribe(res => this.listCourses(res))
  }

  listCourses(result){
    this.tiles = result;
  }

  openCourse(code:string){
    setTimeout(() => {
      if(!this.onapprove) {
        this.router.navigate(['/sub-course', code]);
      }
    }, 10)
  }

  addCourse(){
    let dialogRef = this.dialog.open(AddCourseComponent,{
      data: {category: this.category},
      width: '450px'});
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        result.created = new Date(result.created);
        this.tiles.push(result);
      }
    });
  }

  courseApprove(course){
    this.onapprove = true;
    this.http.approveCourse(course.user, course.code).subscribe((resp:any) =>{
      course.approved = resp.approved;
      this.onapprove = false;
    });
  }
}
