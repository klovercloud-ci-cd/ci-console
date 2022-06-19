import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DeleteConformationDialogComponent } from './delete-conformation-dialog.component';

@NgModule({
  declarations: [DeleteConformationDialogComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  exports: [DeleteConformationDialogComponent],
})
export class DeleteConformationDialogModule {}
