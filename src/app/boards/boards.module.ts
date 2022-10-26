import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BoardColumnComponent } from './board-column/board-column.component';
import { SharedModule } from '../shared/shared.module';
import { BoardComponent } from './board/board.component';
import { BoardsComponent } from './boards/boards.component';
import { TaskComponent } from './task/task.component';
import { TaskModalComponent } from './task-modal/task-modal.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    BoardsComponent,
    BoardComponent,
    BoardColumnComponent,
    TaskComponent,
    TaskModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: 'boards', component: BoardsComponent },
      { path: 'boards/:id', component: BoardComponent },
    ]),
  ],
})
export class BoardsModule {}
