import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { RippleGlobalOptions } from '@angular/material/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CompanyModule } from './company/company.module';
import { SnackbarModule } from './shared/snackbar/snackbar.module';
import { ApplicationModalComponent } from './application/application-modal/application-modal.component';
import { CoreModule } from './core/core.module';
import { ApiCallInterceptor } from './shared/interceptors/api-call.interceptor';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EditorModule } from './editor/editor.module';
import { ChartsModule } from 'ng2-charts';


const globalRippleConfig: RippleGlobalOptions = {
  animation: {
    enterDuration: 600,
    exitDuration: 0,
  },
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    NgxSkeletonLoaderModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatButtonModule,
    HttpClientModule,
    CoreModule,
    MatSidenavModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    CompanyModule,
    LoadingBarModule,
    SnackbarModule,
    EditorModule,
    ChartsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiCallInterceptor,
      multi: true,
    },
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ApplicationModalComponent],
})
export class AppModule {}
