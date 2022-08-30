import { Component, OnInit, Input } from '@angular/core';
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

  deleteTask() {
    console.log('delete task', this.task);
    this.boardService.deleteTask(this.columnId, this.task.id).subscribe();
  }
}
