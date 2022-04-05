import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationListComponent } from './application-list/application-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CiCdPipelineComponent } from './ci-cd-pipeline/ci-cd-pipeline.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    ApplicationListComponent,
    ApplicationListComponent,
    CiCdPipelineComponent,
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
})
export class ApplicationModule {}
