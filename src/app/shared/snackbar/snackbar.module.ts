import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import { SnackComponent } from './snack/snack.component';



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
