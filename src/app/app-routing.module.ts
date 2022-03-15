import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';

const childrenRoutes: Routes = [
  {
    path: 'example',
    loadChildren: () =>
      import('./example/example.module').then((m) => m.ExampleModule),
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
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
