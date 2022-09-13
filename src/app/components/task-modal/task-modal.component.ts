import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
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
  @Input() isEditingTask!: boolean;

  constructor(
    private boardService: BoardService,
    public userService: UserService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {}

  createTask(taskForm: NgForm) {
    if (taskForm.invalid) {
      Object.keys(taskForm.controls).forEach((field) => {
        taskForm.controls[field].markAsTouched({ onlySelf: true });
      });

      return;
    }

    this.boardService
      .addTask(this.taskTitle, this.taskDescription, this.taskUserId, this.id)
      .subscribe(() => {
        this.modalService.dismissAll();
      });
  }

  editTask(taskForm: NgForm) {
    if (taskForm.invalid) {
      Object.keys(taskForm.controls).forEach((field) => {
        taskForm.controls[field].markAsTouched({ onlySelf: true });
      });

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
