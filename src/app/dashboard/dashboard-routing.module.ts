import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCompanyModalComponent } from './add-company-modal/add-company-modal.component';
import { DashboardIndexComponent } from './dashboard-index/dashboard-index.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardIndexComponent,
  },
  {
    path: 'test',
    component: AddCompanyModalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
