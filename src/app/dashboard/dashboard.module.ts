import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { AddCompanyModalComponent } from './add-company-modal/add-company-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from "@angular/material/icon";
import { DashboardIndexComponent } from './dashboard-index/dashboard-index.component';


@NgModule({
  declarations: [
    AddCompanyModalComponent,
    DashboardIndexComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  exports:[]
})
export class DashboardModule { }
