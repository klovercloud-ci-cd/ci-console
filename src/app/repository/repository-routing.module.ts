import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CiCdPipelineComponent } from '../application/ci-cd-pipeline/ci-cd-pipeline.component';
import { RepositoryComponent } from './repository/repository.component';

const routes: Routes = [
  {
    path: ':repoID',
    loadChildren: () =>
      import('../application/application.module').then(
        (m) => m.ApplicationModule
      ),
  },
  {
    path: '',
    component: RepositoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepositoryRoutingModule {}
