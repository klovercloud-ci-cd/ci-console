import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CiCdPipelineComponent } from '../application/ci-cd-pipeline/ci-cd-pipeline.component';
import { RepositoryComponent } from './repository/repository.component';

const routes: Routes = [
  {
    path: '',
    component: RepositoryComponent,
  },
  {
    path: '/:id',
    component: CiCdPipelineComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepositoryRoutingModule {}
