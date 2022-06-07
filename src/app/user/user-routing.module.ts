import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guard/auth.guard';
import { UserFormComponent } from './user-form/user-form.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'add-new',
    component: UserFormComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: ':id/update',
    component: UserFormComponent,
    // canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
