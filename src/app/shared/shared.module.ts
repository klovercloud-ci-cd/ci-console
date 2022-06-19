import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToasterComponent } from './toaster/toaster.component';

@NgModule({
  declarations: [
    ToasterComponent
  ],
  imports: [CommonModule, RouterModule],
  exports: [],
})
export class SharedModule {}
