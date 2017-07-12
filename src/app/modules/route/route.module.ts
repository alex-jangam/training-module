import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { CategoryComponent } from '../../components/category/category.component';
import { LoginComponent } from '../../components/login/login.component';
import { BaseComponent } from '../../components/base/base.component';

const routes: Routes = [
  { path: '', redirectTo : 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: '', component: BaseComponent ,
  children: [
    { path: 'dashboard', component: DashboardComponent},
    { path: 'course/:id', component: CategoryComponent}
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
