import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { TranslateService } from '@ngx-translate/core';
import { Dialog } from '@angular/cdk/dialog';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';

import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  faXmark = faXmark;

  constructor(
    private boardService: BoardService,
    private dialog: Dialog,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {}

  @Input()
  task!: Task;
  @Input()
  columnId!: string;
  @Output()
  edit = new EventEmitter();

  openDialog(e: Event): void {
    e.preventDefault();
    e.stopPropagation();

    const dialogRef = this.dialog.open<string>(ConfirmDialogComponent, {
      data: {
        title: this.translateService.instant('deleteTaskPrompt'),
      },
    });

    dialogRef.closed.subscribe((message) => {
      if (message) {
        this.deleteTask();
      }
    });
  }

  deleteTask() {
    this.boardService.deleteTask(this.columnId, this.task.id).subscribe();
  }

  editTask() {
    this.edit.emit();
  }
}
