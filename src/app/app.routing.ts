import { Routes, RouterModule } from "@angular/router";

import { UserListComponent } from "./user/user-list/user-list.component";
import { UserFormComponent } from "./user/user-form/user-form.component";
import { UserDetailComponent } from "./user/user-detail/user-detail.component";
import { ClientListComponent } from "./client/client-list/client-list.component";
import { ClientFormComponent } from "./client/client-form/client-form.component";
import { ClientDetailComponent } from "./client/client-detail/client-detail.component";
import { EventComponent } from "./event/event/event.component";

const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/user', pathMatch: 'full' },
  { path: 'user', component: UserListComponent },
  { path: 'user/form', component: UserFormComponent },
  { path: 'user/details/:id', component: UserDetailComponent },
  { path: 'user/form/:id', component: UserFormComponent },
  { path: 'client', component: ClientListComponent },
  { path: 'client/form', component: ClientFormComponent },
  { path: 'client/details/:id', component: ClientDetailComponent},
  { path: 'client/form/:id', component: ClientFormComponent },
  { path: 'event', component: EventComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
