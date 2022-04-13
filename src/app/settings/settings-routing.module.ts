import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GeneralSettingsComponent} from "./general-settings/general-settings.component";

const routes: Routes = [
  {
    path:'',
    pathMatch:'full',
    redirectTo: 'general'
  },
  {
    path:'general',
    component:GeneralSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
