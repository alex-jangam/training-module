import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule , MdIconModule} from '@angular/material';
import { HttpModule } from '@angular/http';

// Component go to declarations
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BaseComponent } from './components/base/base.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddCategoryComponent } from './modals/add-category/add-category.component';
import 'hammerjs';

// Services go to providers
import {LocalstoreService} from './services/localStore/localstore.service'
import {UtilsService} from './services/utils/utils.service';
import { OverlayService } from 'app/services/overlay/overlay.service';
import { LoginChangeinService } from 'app/services/login/login.service';
import {HttpService} from './services/http/http.service'
import {CategoryService} from './services/category/category.service'
import {CoursesService} from 'app/services/courses/courses.service';
import {SubCoursesService} from 'app/services/sub-courses/sub-courses.service';

// Modules go to imports
import {Routing} from './modules/route/route.module';
import { CategoryComponent } from './components/category/category.component';
import { CoursesComponent } from './components/courses/courses.component';
import { SubCourseComponent } from './components/sub-course/sub-course.component';
import { TopicComponent } from './components/topic/topic.component';
import { OverlayComponent } from './components/overlay/overlay.component';
import { AddCourseComponent } from './modals/add-course/add-course.component';
import { AddTopicComponent } from 'app/modals/add-topic/add-topic.component';
import { RedirectComponent } from './components/redirect/redirect.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BaseComponent,
    NavigationComponent,
    RegisterComponent,
    DashboardComponent,
    AddCategoryComponent,
    CategoryComponent,
    CoursesComponent,
    SubCourseComponent,
    TopicComponent,
    OverlayComponent,
    AddCourseComponent,
    AddTopicComponent,
    RedirectComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,MdIconModule,
    Routing,
    FormsModule,
    BrowserAnimationsModule,
    HttpModule,
  ],
  providers: [
    LocalstoreService,
    UtilsService,
    OverlayService,
    LoginChangeinService,
    HttpService,
    CategoryService,
    CoursesService,
    SubCoursesService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AddCategoryComponent,
    AddCourseComponent,
    AddTopicComponent
  ]
})
export class AppModule { }
