import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { BaseComponent } from 'app/components/base/base.component';
import { LoginComponent } from 'app/components/login/login.component';
import { DashboardComponent } from 'app/components/dashboard/dashboard.component';
import { CategoryComponent } from 'app/components/category/category.component';
import { CoursesComponent } from 'app/components/courses/courses.component';
import { RedirectComponent } from 'app/components/redirect/redirect.component';
import { SubCourseComponent } from 'app/components/sub-course/sub-course.component';
import { TopicComponent } from 'app/components/topic/topic.component';

const routes: Routes = [
  { path: '', redirectTo : 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: '', component: BaseComponent ,
  children: [
    { path: 'dashboard', component: DashboardComponent},
    { path: 'course', component: RedirectComponent},
    { path: 'course/:category', component: CoursesComponent},
    { path: 'sub-course/:id', component: SubCourseComponent},
    { path: 'topic/:id', component: TopicComponent},
  ]},
];
export const Routing = RouterModule.forRoot(routes, { useHash: true });

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})


export class RouteModule { }
