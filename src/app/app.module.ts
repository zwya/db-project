import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { routing } from './app.routing';
import { UserFormComponent } from './user/user-form/user-form.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { ClientListComponent } from './client/client-list/client-list.component';
import { ClientFormComponent } from './client/client-form/client-form.component';
import { ClientDetailComponent } from './client/client-detail/client-detail.component';
import { SigninComponent } from './auth/signin/signin.component';
import { LoggedinGuard } from './guards/loggedin.guard';
import { AdminGuard } from './guards/admin.guard';
import { DefaultpageGuard } from './guards/defaultpage.guard';
import { ClientSearchComponent } from './client/client-search/client-search.component';
import { ClientUpdateComponent } from './client/client-update/client-update.component';
import { ClientUpdateAdminComponent } from './client/client-update-admin/client-update-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    UserListComponent,
    UserFormComponent,
    UserDetailComponent,
    ClientListComponent,
    ClientFormComponent,
    ClientDetailComponent,
    SigninComponent,
    ClientSearchComponent,
    ClientUpdateComponent,
    ClientUpdateAdminComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing
  ],
  providers: [LoggedinGuard, AdminGuard, DefaultpageGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
