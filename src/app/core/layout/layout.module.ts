import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LayoutComponent } from './layout.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
  declarations: [LayoutComponent, HeaderComponent, SidebarComponent],
  imports: [
    AppRoutingModule,
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [LayoutComponent, HeaderComponent, SidebarComponent],
})
export class LayoutModule {}
