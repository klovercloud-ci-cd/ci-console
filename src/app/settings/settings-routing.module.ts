import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Error404Component } from '../error/error404/error404.component';

const childrenRoutes: Routes = [];

const routes: Routes = [
  {
    path: '',
    children: childrenRoutes,
  },
  {
    path: '**',
    component: Error404Component,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
