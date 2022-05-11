import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { Error404Component } from './error/error404/error404.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { DashboardIndexComponent } from './dashboard/dashboard-index/dashboard-index.component';
import { AppCustomPreloader } from './app-custom-preloader';

const childrenRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsModule),
  },
  {
    path: 'user-profile',
    loadChildren: () =>
      import('./user-profile/user-profile.module').then(
        (m) => m.UserProfileModule
      ),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsModule),
  },
  {
    path: 'user-profile',
    loadChildren: () =>
      import('./user-profile/user-profile.module').then(
        (m) => m.UserProfileModule
      ),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./application/application.module').then(
        (m) => m.ApplicationModule
      ),
  },
  {
    path: 'test',
    component: DashboardIndexComponent,
  },
  {
    path: 'attach-company',
    loadChildren: () =>
      import('./company/company.module').then((m) => m.CompanyModule),
  },
  {
    path: 'repository',
    loadChildren: () =>
      import('./repository/repository.module').then((m) => m.RepositoryModule),
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
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: Error404Component,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: AppCustomPreloader,
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'corrected',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
  providers: [AppCustomPreloader],
})
export class AppRoutingModule {}
