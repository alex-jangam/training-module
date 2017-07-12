import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpService} from '../../services/http/http.service'

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categoryId: any;
  constructor(private route: ActivatedRoute,private http : HttpService) { }

  ngOnInit() {
    this.categoryId = this.route.params.subscribe(params => {
       this.categoryId = +params['id']; // (+) converts string 'id' to a number
    });
  }

  getCategories(){
      this.http.getCategories().subscribe(res => this.listCategories(res.json()))
  }

  listCategories(result){
    console.log(result)
  }

}
