import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { DashboardIndexComponent } from './dashboard-index/dashboard-index.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardIndexComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
