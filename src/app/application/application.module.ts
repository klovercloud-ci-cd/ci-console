import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationListComponent } from './application-list/application-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CiCdPipelineComponent } from './ci-cd-pipeline/ci-cd-pipeline.component';
import { MatCardModule } from '@angular/material/card';
import { PipelineLogComponent } from './pipeline-log/pipeline-log.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApplicationModalComponent } from './application-modal/application-modal.component';

@NgModule({
  declarations: [
    ApplicationListComponent,
    ApplicationListComponent,
    CiCdPipelineComponent,
    PipelineLogComponent,
    ApplicationModalComponent,
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,

    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,

    MatProgressSpinnerModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatFormFieldModule,
  ],
})
export class ApplicationModule {}
