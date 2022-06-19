import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LayoutModule } from './layout/layout.module';
import { DeleteConformationDialogComponent } from './components/delete-conformation-dialog/delete-conformation-dialog.component';
import { DeleteConformationDialogModule } from './components/delete-conformation-dialog/delete-conformation-dialog.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, LayoutModule, RouterModule, DeleteConformationDialogModule,  MatSnackBarModule],
  exports: [DeleteConformationDialogModule]
})
export class CoreModule {}
