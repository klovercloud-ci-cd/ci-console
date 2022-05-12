import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationListComponent } from './application-list/application-list.component';
import { CiCdPipelineComponent } from './ci-cd-pipeline/ci-cd-pipeline.component';
import { PipelineLogComponent } from './pipeline-log/pipeline-log.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationListComponent,
  },
  {
    path: 'application/:appID',
    component: CiCdPipelineComponent,
  },
  {
    path: 'log',
    component: PipelineLogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
