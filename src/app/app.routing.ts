import { Routes, RouterModule } from "@angular/router";

import { UserListComponent } from "./user/user-list/user-list.component";
import { UserFormComponent } from "./user/user-form/user-form.component";
import { UserDetailComponent } from "./user/user-detail/user-detail.component";

const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/user', pathMatch: 'full' },
  { path: 'user', component: UserListComponent },
  { path: 'user/form', component: UserFormComponent },
  { path: 'user/details/:id', component: UserDetailComponent },
  { path: 'user/form/:id', component: UserFormComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
