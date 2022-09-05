import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DialogModule } from '@angular/cdk/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { AuthComponent } from './pages/auth/auth.component';
import { BoardsComponent } from './pages/boards/boards.component';
import { BoardComponent } from './pages/board/board.component';
import { ColumnComponent } from './components/column/column.component';
import { TaskComponent } from './components/task/task.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

import { Router } from '@angular/router';
import { UnauthorisedErrorInterceptor } from './interceptors/unauthorised-error.interceptor';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    WelcomeComponent,
    AuthComponent,
    BoardsComponent,
    BoardComponent,
    ColumnComponent,
    TaskComponent,
    EditProfileComponent,
    ConfirmDialogComponent,
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
