import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { BoardsComponent } from './pages/boards/boards.component';
import { BoardComponent } from './pages/board/board.component';
import { AuthFormComponent } from './components/auth-form/auth-form.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'login', component: AuthFormComponent, data: { type: 'login' } },
  { path: 'signup', component: AuthFormComponent, data: { type: 'signup' } },
  {
    path: 'edit-profile',
    component: AuthFormComponent,
    data: { type: 'editProfile' },
  },
  { path: 'boards', component: BoardsComponent },
  { path: 'boards/:id', component: BoardComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
