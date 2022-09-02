import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  faXmark = faXmark;

  constructor(private boardService: BoardService) {}

  ngOnInit(): void {}

  @Input()
  task!: Task;
  @Input()
  columnId!: string;
  @Output()
  edit = new EventEmitter();

  deleteTask(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.boardService.deleteTask(this.columnId, this.task.id).subscribe();
  }

  editTask() {
    this.edit.emit();
  }
}
