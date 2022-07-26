import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ApplicationListComponent } from './application-list/application-list.component';
import { CiCdPipelineComponent } from './ci-cd-pipeline/ci-cd-pipeline.component';
import {LightHouseComponent} from "./light-house/light-house.component";
import {LighthouseGraphComponent} from "./lighthouse-graph/lighthouse-graph.component";

const routes: Routes = [
  {
    path: '',
    component: ApplicationListComponent,
  },
  {
    path: 'application',
    component: CiCdPipelineComponent,
  },
  {
    path: 'lighthouse',
    component: LightHouseComponent,
  },
  {
    path: 'lighthouse-graph',
    component: LighthouseGraphComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
