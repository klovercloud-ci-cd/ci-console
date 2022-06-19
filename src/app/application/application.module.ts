import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PipelineGraphComponent } from './pipeline-graph/pipeline-graph.component';
import { PipelineOverviewComponent } from './pipeline-overview/pipeline-overview.component';
import { ApplicationModalComponent } from './application-modal/application-modal.component';
import { CiCdPipelineComponent } from './ci-cd-pipeline/ci-cd-pipeline.component';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ApplicationRoutingModule } from './application-routing.module';
import { EditorModule } from '../editor/editor.module';
import { AppEditorModalComponent } from './app-editor-modal/app-editor-modal.component';

import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";


@NgModule({
  declarations: [
    ApplicationListComponent,
    CiCdPipelineComponent,
    ApplicationModalComponent,
    PipelineGraphComponent,
    PipelineOverviewComponent,
    AppEditorModalComponent,
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
    MatMenuModule,
    MatButtonModule,
    MatSelectModule,
    MatTabsModule,
    MatRippleModule,
    MatProgressBarModule,
    NgxSkeletonLoaderModule,
    EditorModule,
    MatDividerModule,
    MatListModule,
  ],
})
export class ApplicationModule {}
