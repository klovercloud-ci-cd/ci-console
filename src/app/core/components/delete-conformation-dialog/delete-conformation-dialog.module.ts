import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteConformationDialogComponent } from './delete-conformation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [DeleteConformationDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [DeleteConformationDialogComponent]
})
export class DeleteConformationDialogModule { }
