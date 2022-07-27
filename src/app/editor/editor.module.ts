import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor/editor.component';
import { MatMenuModule } from '@angular/material/menu';
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";
import { LighthouseInfoEditorComponent } from './lighthouse-info-editor/lighthouse-info-editor.component';

@NgModule({
  declarations: [
    EditorComponent,
    LighthouseInfoEditorComponent,
  ],
  imports: [
    CommonModule,MatMenuModule, MatIconModule,MatDialogModule
  ],
  exports: [
    EditorComponent,
    LighthouseInfoEditorComponent,
  ]
})
export class EditorModule { }
