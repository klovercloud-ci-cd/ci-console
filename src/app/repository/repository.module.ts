import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepositoryRoutingModule } from './repository-routing.module';
import { RepositoryComponent } from './repository/repository.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatRippleModule } from '@angular/material/core';
import { RepositoryModalComponent } from './repository-modal/repository-modal.component';

@NgModule({
  declarations: [RepositoryComponent, RepositoryModalComponent],
  imports: [
    CommonModule,
    RepositoryRoutingModule,
    MatCardModule,
    MatIconModule,
    FlexLayoutModule,
    MatRippleModule,
  ],
})
export class RepositoryModule {}
