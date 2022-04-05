import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationListComponent } from './application-list/application-list.component';
import { CiCdPipelineComponent } from './ci-cd-pipeline/ci-cd-pipeline.component';

const routes: Routes = [
  {
    path: 'pipe',
    component: CiCdPipelineComponent,
  },
  {
    path: 'list',
    component: ApplicationListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
