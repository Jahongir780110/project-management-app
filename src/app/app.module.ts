import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { UnauthorisedErrorInterceptor } from './user/unauthorised-error.interceptor';
import { WelcomeModule } from './welcome/welcome.module';
import { UserModule } from './user/user.module';
import { BoardsModule } from './boards/boards.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    WelcomeModule,
    UserModule,
    BoardsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorisedErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
