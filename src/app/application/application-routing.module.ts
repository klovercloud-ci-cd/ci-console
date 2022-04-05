import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ApplicationPipelineComponent } from './application-pipeline/application-pipeline.component';

const routes: Routes = [
  {
    path: 'list',
    component: ApplicationListComponent,
  },
  {
    path: 'pipeline',
    component: ApplicationPipelineComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
