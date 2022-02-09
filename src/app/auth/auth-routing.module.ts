import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {RegistrationComponent} from "./registration/registration.component";

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'CI-console | Log In'
    }
  },
  {
    path: 'register',
    component: RegistrationComponent,
    data: {
      title: 'CI-console | Register'
    }
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
