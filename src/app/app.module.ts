import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DialogModule } from '@angular/cdk/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { BoardsComponent } from './pages/boards/boards.component';
import { BoardComponent } from './pages/board/board.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { BoardColumnComponent } from './components/board-column/board-column.component';
import { TaskComponent } from './components/task/task.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { TaskModalComponent } from './components/task-modal/task-modal.component';

import { CheckPasswordsDirective } from './directives/check-passwords.directive';
import { TrimDirective } from './directives/trim.directive';

import { Router } from '@angular/router';
import { UnauthorisedErrorInterceptor } from './interceptors/unauthorised-error.interceptor';
import { UserService } from './services/user.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    WelcomeComponent,
    BoardsComponent,
    BoardComponent,
    BoardColumnComponent,
    TaskComponent,
    ConfirmDialogComponent,
    SignupComponent,
    LoginComponent,
    EditProfileComponent,
    TaskModalComponent,
    CheckPasswordsDirective,
    TrimDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    FontAwesomeModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DragDropModule,
    MatSnackBarModule,
    DialogModule,
    MatProgressSpinnerModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en-US',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: function (router: Router, userService: UserService) {
        return new UnauthorisedErrorInterceptor(router, userService);
      },
      multi: true,
      deps: [Router, UserService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
