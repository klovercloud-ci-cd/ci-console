import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from '../error/error404/error404.component';
import {GeneralSettingsComponent} from "./general-settings/general-settings.component";

const childrenRoutes: Routes = [

]

const routes: Routes = [
  {
    path: '',
    children: childrenRoutes,
  },
  {
    path: '**',
    component: Error404Component,
  },
  // {
  //   path:'',
  //   pathMatch:'full',
  //   redirectTo: 'general'
  // },
  // {
  //   path:'general',
  //   component:GeneralSettingsComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
