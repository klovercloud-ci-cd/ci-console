import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTreeModule } from '@angular/material/tree';

import { MatRippleModule } from '@angular/material/core';
import { ProgressBarModule } from 'src/app/progress-bar/progress-bar.module';
import {MatBadgeModule} from "@angular/material/badge";
import { ToastrModule } from 'ngx-toastr';
import { CollapsedSidebarComponent } from './collapsed-sidebar/collapsed-sidebar.component';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import {MatDividerModule} from "@angular/material/divider";

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    CollapsedSidebarComponent,
  ],
    imports: [
        ToastrModule.forRoot(),
        AppRoutingModule,
        CommonModule,
        RouterModule,
        MatSidenavModule,
        MatIconModule,
        MatCardModule,
        MatDialogModule,
        MatButtonModule,
        MatMenuModule,
        MatExpansionModule,
        MatTreeModule,
        MatRippleModule,
        ProgressBarModule,
        MatBadgeModule,
        MatDividerModule,
    ],
  exports: [LayoutComponent, HeaderComponent, SidebarComponent],
})
export class LayoutModule {}
