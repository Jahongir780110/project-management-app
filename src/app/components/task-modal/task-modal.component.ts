import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { BoardService } from 'src/app/services/board.service';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.css'],
})
export class TaskModalComponent implements OnInit {
  @Input() id!: string;
  @Input() editedTask!: Task;
  @Input() taskTitle!: string;
  @Input() taskDescription!: string;
  @Input() taskUserId!: string;
  @Input() titleError!: boolean;
  @Input() taskTitleError!: boolean;
  @Input() taskDescriptionError!: boolean;
  @Input() isEditingTask!: boolean;

  constructor(
    private boardService: BoardService,
    public userService: UserService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {}

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
}
