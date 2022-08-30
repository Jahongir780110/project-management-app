import { Component, OnInit, Input } from '@angular/core';
import { BoardService } from 'src/app/services/board.service';
import { UserService } from 'src/app/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Column } from '../../models/column.model';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css'],
})
export class ColumnComponent implements OnInit {
  faEllipsisVertical = faEllipsisVertical;
  faTrash = faTrash;
  taskTitle = '';
  taskDescription = '';
  taskUserId = '';
  column!: Column;

  @Input()
  title!: string;
  @Input()
  id!: string;

  constructor(
    private boardService: BoardService,
    public userService: UserService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe();
    const column = this.boardService.selectedBoard.columns?.find(
      (col) => col.id === this.id
    );
    if (column) {
      this.column = column;
    }
  }

  deleteColumn() {
    this.boardService.deleteColumn(this.id).subscribe();
  }

  createTask() {
    this.boardService
      .addTask(this.taskTitle, this.taskDescription, this.taskUserId, this.id)
      .subscribe(() => {
        this.modalService.dismissAll();
      });
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        () => {
          this.taskTitle = '';
          this.taskDescription = '';
          this.taskUserId = '';
        },
        () => {
          this.taskTitle = '';
          this.taskDescription = '';
          this.taskUserId = '';
        }
      );
  }
}
