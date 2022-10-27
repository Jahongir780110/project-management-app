import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { UnauthorisedErrorInterceptor } from '../user/unauthorised-error.interceptor';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [HeaderComponent, FooterComponent],
  imports: [CommonModule, SharedModule, RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorisedErrorInterceptor,
      multi: true,
    },
  ],
  exports: [HeaderComponent, FooterComponent],
})
export class CoreModule {}
