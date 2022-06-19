import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorRoutingModule } from './error-routing.module';
import { Error404Component } from './error404/error404.component';
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [Error404Component],
  imports: [CommonModule, ErrorRoutingModule,
    RouterModule],
})
export class ErrorModule {}
