import { Routes, RouterModule } from "@angular/router";

import { UserListComponent } from "./user/user-list/user-list.component";
import { UserFormComponent } from "./user/user-form/user-form.component";
import { UserDetailComponent } from "./user/user-detail/user-detail.component";
import { ClientListComponent } from "./client/client-list/client-list.component";
import { ClientFormComponent } from "./client/client-form/client-form.component";
import { ClientDetailComponent } from "./client/client-detail/client-detail.component";
import { EventComponent } from "./event/event/event.component";
import { SigninComponent } from "./auth/signin/signin.component";
import { LoggedinGuard } from './guards/loggedin.guard';
import { AdminGuard } from './guards/admin.guard';
import { DefaultpageGuard } from './guards/defaultpage.guard';

const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', canActivate: [DefaultpageGuard], component: SigninComponent },
  { path: 'user', component: UserListComponent, canActivate: [AdminGuard, LoggedinGuard] },
  { path: 'user/form', component: UserFormComponent, canActivate: [AdminGuard, LoggedinGuard] },
  { path: 'user/details/:id', component: UserDetailComponent, canActivate: [AdminGuard, LoggedinGuard] },
  { path: 'user/form/:id', component: UserFormComponent, canActivate: [AdminGuard, LoggedinGuard] },
  { path: 'client', component: ClientListComponent, canActivate: [LoggedinGuard] },
  { path: 'client/form', component: ClientFormComponent, canActivate: [LoggedinGuard] },
  { path: 'client/details/:id', component: ClientDetailComponent, canActivate: [LoggedinGuard] },
  { path: 'client/form/:id', component: ClientFormComponent, canActivate: [LoggedinGuard] },
  { path: 'event', component: EventComponent, canActivate: [LoggedinGuard] },
  { path: 'signin', component: SigninComponent}
];

export const routing = RouterModule.forRoot(APP_ROUTES);
