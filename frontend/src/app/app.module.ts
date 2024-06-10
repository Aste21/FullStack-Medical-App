import {inject, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {StudentsComponent} from "./students/students.component";
import {RouterModule, Routes} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {UserComponent} from "./user/user.component";
import {AdminComponent} from "./admin/admin.component";
import {RoleGuard} from "./guards/role.guard";
import {httpInterceptorProviders} from "./auth/auth-interceptor";
import {authGuard} from "./guards/auth.guard";
import { DoctorsComponent } from './doctors/doctors.component';
import { UserListComponent } from './user-list/user-list.component';
import { VisitComponent } from './visit/visit.component';
import { PatientVisitsComponent } from './patient-visits/patient-visits.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'user', component: UserComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_USER','ROLE_ADMIN'] },},
  { path: 'doctors', component: DoctorsComponent, canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] },},
  { path: 'visits', component: VisitComponent, canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] },},
  { path: 'admin', component: AdminComponent, canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] },},
  { path: 'patient-visits', component: PatientVisitsComponent, canActivate: [authGuard], data: { roles: ['ROLE_USER'] },},
  { path: 'auth/login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    StudentsComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    AdminComponent,
    DoctorsComponent,
    UserListComponent,
    VisitComponent,
    PatientVisitsComponent
  ],
  imports: [
    BrowserModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
