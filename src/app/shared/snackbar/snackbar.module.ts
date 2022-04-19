import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackComponent } from './snack/snack.component';
import {MatIconModule} from '@angular/material/icon';



@NgModule({
  declarations: [
    SnackComponent
  ],
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatIconModule
  ]
})
export class SnackbarModule { }
