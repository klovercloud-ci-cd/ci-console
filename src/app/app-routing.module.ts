import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { Error404Component } from './error/error404/error404.component';
import { AuthGuard } from './shared/guard/auth.guard';
import {DashboardIndexComponent} from "./dashboard/dashboard-index/dashboard-index.component";

const childrenRoutes: Routes = [
  {
    path: 'example',
    loadChildren: () =>
      import('./example/example.module').then((m) => m.ExampleModule),
  },
  {
    path:'',
    component: DashboardIndexComponent
  },
  {
    path: 'company',
    loadChildren: () =>
      import('./company/company.module').then((m) => m.CompanyModule),
  },
];

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    data: {
      containerEnabled: true,
    },
  },
  {
    path: '',
    component: LayoutComponent,
    children: childrenRoutes,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: Error404Component,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
