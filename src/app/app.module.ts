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
import {HttpService} from './services/http/http.service'
import {LocalstoreService} from './services/localStore/localstore.service'
import {UtilsService} from './services/utils/utils.service'

// Modules go to imports
import {Routing} from './modules/route/route.module';
import { CategoryComponent } from './components/category/category.component';

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
    HttpService,
    LocalstoreService,
    UtilsService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AddCategoryComponent
  ]
})
export class AppModule { }
