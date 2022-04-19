import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DashboardIndexComponent } from './dashboard-index/dashboard-index.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [ DashboardIndexComponent],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        MatDialogModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatExpansionModule,
        FlexLayoutModule,
    ],
  exports: [],
})
export class DashboardModule {}
