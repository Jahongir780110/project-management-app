import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from 'src/app/services/board.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  title = '';
  boardId = '';

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    public boardService: BoardService
  ) {}

  ngOnInit(): void {
    const boardId = this.route.snapshot.paramMap.get('id') as string;
    this.boardId = boardId;
    this.boardService.getBoard(boardId).subscribe();
  }

  createColumn() {
    if (this.title.trim().length === 0) {
      return;
    }

    this.boardService.addColumn(this.title).subscribe();
    this.modalService.dismissAll();
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        () => {
          this.title = '';
        },
        () => {
          this.title = '';
        }
      );
  }
}
