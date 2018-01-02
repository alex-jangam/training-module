import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {CoursesService} from 'app/services/courses/courses.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categoryId: any;
  constructor(private route: ActivatedRoute,private http : CoursesService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
       this.categoryId = +params['id']; // (+) converts string 'id' to a number
       this.getCourses(params['id'] || "all")
    });
  }

  getCourses(id){
    this.http.getCourses(id).subscribe(res => this.listCourses(res))
  }

  listCourses(result){
    console.log(result)
  }

}
