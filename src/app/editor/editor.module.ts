import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor/editor.component';
import { MatMenuModule } from '@angular/material/menu';
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
  declarations: [
    EditorComponent,
  ],
  imports: [
    CommonModule,MatMenuModule, MatIconModule,MatDialogModule
  ],
  exports: [
    EditorComponent
  ]
})
export class EditorModule { }
