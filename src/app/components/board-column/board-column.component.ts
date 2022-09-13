import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { BoardService } from 'src/app/services/board.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Dialog } from '@angular/cdk/dialog';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';

import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import {
  faTrash,
  faPen,
  faXmark,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { Column } from '../../models/column.model';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.css'],
})
export class BoardColumnComponent implements OnInit {
  faEllipsisVertical = faEllipsisVertical;
  faTrash = faTrash;
  faPen = faPen;
  faXmark = faXmark;
  faCheck = faCheck;

  column!: Column;
  editedTask!: Task;
  columnTitle = '';
  taskTitle = '';
  taskDescription = '';
  taskUserId = '';
  titleError = false;
  isEditingTask = false;
  isEditingTitle = false;

  @ViewChild('titleInput') titleInput!: ElementRef;
  @Input()
  title!: string;
  @Input()
  id!: string;
  @Input()
  order!: number;

  constructor(
    public userService: UserService,
    private boardService: BoardService,
    private modalService: NgbModal,
    private translateService: TranslateService,
    private dialog: Dialog
  ) {}

  ngOnInit(): void {
    const column = this.boardService.selectedBoard.columns?.find(
      (col) => col.id === this.id
    );
    if (column) {
      this.column = column;
      this.column.tasks?.sort((a, b) => (a.order < b.order ? -1 : 1));
    }
  }

  cancelEditing() {
    this.isEditingTitle = false;
    this.columnTitle = '';
  }

  openEditTitleInput() {
    this.isEditingTitle = true;
    this.titleError = false;
    this.columnTitle = this.title;

    setTimeout(() => {
      this.titleInput.nativeElement.focus();
    }, 0);
  }

  editColumn() {
    this.titleError = false;

    if (this.columnTitle.trim().length === 0) {
      this.titleError = true;
      return;
    }

    this.boardService
      .editColumn(this.id, this.order, this.columnTitle)
      .subscribe(() => {
        this.isEditingTitle = false;
        this.columnTitle = '';
      });
  }

  deleteColumn() {
    this.boardService.deleteColumn(this.id).subscribe();
  }

  openEditTaskForm(task: Task) {
    this.isEditingTask = true;
    this.editedTask = task;
    this.taskTitle = task.title;
    this.taskDescription = task.description;
    this.taskUserId = task.userId;
  }

  openModalWindow(content: any) {
    this.modalService.open(content).result.then(null, () => {
      this.initializeForm();
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open<string>(ConfirmDialogComponent, {
      data: {
        title: this.translateService.instant('deleteColumnPrompt'),
      },
    });

    dialogRef.closed.subscribe((message) => {
      if (message) {
        this.deleteColumn();
      }
    });
  }

  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.boardService
        .editTask(this.column.id, event.item.data.id, {
          ...event.item.data,
          order: event.currentIndex + 1,
          columnId: this.id,
        })
        .subscribe();
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.boardService
        .editTask(
          event.previousContainer.id,
          event.item.data.id,
          {
            ...event.item.data,
            order: event.currentIndex + 1,
            columnId: event.container.id,
          },
          true
        )
        .subscribe();
    }
  }

  initializeForm() {
    this.taskTitle = '';
    this.taskDescription = '';
    this.taskUserId = '';
    this.isEditingTask = false;
  }
}
