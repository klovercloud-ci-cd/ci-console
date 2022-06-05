import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AddCompanyComponent } from './add-company/add-company.component';
import { AttachCompanyComponent } from './attach-company/attach-company.component';

const routes: Routes = [
  {
    path: '',
    component: AttachCompanyComponent,
  },
  // {
  //   path: '',
  //   component: AddCompanyComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
