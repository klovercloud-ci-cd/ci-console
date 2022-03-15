import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExampleListComponent } from './example-list/example-list.component';

const routes: Routes = [
  {
    path: 'ex',
    component: ExampleListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExampleRoutingModule {}
