import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { BoardService } from 'src/app/services/board.service';
import { UserService } from 'src/app/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Dialog } from '@angular/cdk/dialog';
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
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css'],
})
export class ColumnComponent implements OnInit {
  faEllipsisVertical = faEllipsisVertical;
  faTrash = faTrash;
  faPen = faPen;
  faXmark = faXmark;
  faCheck = faCheck;

  taskTitle = '';
  taskDescription = '';
  taskUserId = '';
  column!: Column;
  isEditingTitle = false;
  columnTitle = '';
  isEditingTask = false;
  editedTask!: Task;
  titleError = false;
  taskTitleError = false;
  taskDescriptionError = false;

  @ViewChild('titleInput') titleInput!: ElementRef;
  @Input()
  title!: string;
  @Input()
  id!: string;
  @Input()
  order!: number;

  constructor(
    private boardService: BoardService,
    public userService: UserService,
    private modalService: NgbModal,
    public dialog: Dialog
  ) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe();

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
    this.titleError = false;
    this.isEditingTitle = true;
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

  createTask() {
    this.taskTitleError = false;
    this.taskDescriptionError = false;

    if (!this.taskTitle.trim().length) {
      this.taskTitleError = true;
      return;
    }
    if (!this.taskDescription.trim().length) {
      this.taskDescriptionError = true;
      return;
    }

    this.boardService
      .addTask(this.taskTitle, this.taskDescription, this.taskUserId, this.id)
      .subscribe(() => {
        this.modalService.dismissAll();
      });
  }

  editTask() {
    this.taskTitleError = false;
    this.taskDescriptionError = false;

    if (!this.taskTitle.trim().length) {
      this.taskTitleError = true;
      return;
    }
    if (!this.taskDescription.trim().length) {
      this.taskDescriptionError = true;
      return;
    }

    this.boardService
      .editTask(this.id, this.editedTask.id, {
        ...this.editedTask,
        title: this.taskTitle,
        description: this.taskDescription,
        userId: this.taskUserId,
        columnId: this.id,
      })
      .subscribe(() => {
        this.modalService.dismissAll();
      });
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        () => {
          this.initializeForm();
        },
        () => {
          this.initializeForm();
        }
      );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open<string>(ConfirmDialogComponent, {
      data: {
        type: 'column',
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
    this.taskTitleError = false;
    this.taskDescriptionError = false;
  }
}
