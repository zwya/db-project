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
import { EventComponent } from './event/event/event.component';

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
    EventComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
