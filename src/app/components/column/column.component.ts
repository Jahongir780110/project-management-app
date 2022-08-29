import { Component, OnInit, Input } from '@angular/core';
import { BoardService } from 'src/app/services/board.service';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css'],
})
export class ColumnComponent implements OnInit {
  faEllipsisVertical = faEllipsisVertical;
  faTrash = faTrash;

  @Input()
  title!: string;
  @Input()
  id!: string;

  constructor(private boardService: BoardService) {}

  ngOnInit(): void {}

  deleteColumn() {
    this.boardService.deleteColumn(this.id).subscribe();
  }
}
