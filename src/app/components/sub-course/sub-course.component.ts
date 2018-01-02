import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router';
import {SubCoursesService} from 'app/services/sub-courses/sub-courses.service';

@Component({
  selector: 'app-sub-course',
  templateUrl: './sub-course.component.html',
  styleUrls: ['./sub-course.component.scss']
})
export class SubCourseComponent implements OnInit {
  categoryId: any;
  tiles:any[] = [];
  constructor(private router: Router, private route: ActivatedRoute,private http : SubCoursesService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
       this.categoryId = +params['id']; // (+) converts string 'id' to a number
       this.getCourses(params['id'] || "all")
    });
  }

  getCourses(id){
    this.http.getSubCourses(id).subscribe(res => this.listCourses(res))
  }

  listCourses(result){
    this.tiles = result;
  }

  openCourse(code:string){
    this.router.navigate(['/topic', code]);
  }
}
