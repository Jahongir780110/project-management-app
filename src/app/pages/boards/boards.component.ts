import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/services/board.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Board } from 'src/app/models/board.model';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css'],
})
export class BoardsComponent implements OnInit {
  faXmark = faXmark;
  title = '';
  description = '';
  deletingBoardId = '';

  constructor(
    private modalService: NgbModal,
    public boardService: BoardService
  ) {}

  ngOnInit(): void {
    this.boardService.getAllBoards().subscribe();
  }

  createBoard() {
    this.boardService
      .createBoard(this.title, this.description)
      .subscribe(() => {
        this.modalService.dismissAll();
      });
  }

  deleteBoard() {
    this.boardService.deleteBoard(this.deletingBoardId).subscribe(() => {
      this.modalService.dismissAll();
    });
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        () => {
          this.title = '';
          this.description = '';
        },
        () => {
          this.title = '';
          this.description = '';
        }
      );
  }

  deleteBoardWithPrompt(event: Event, id: string) {
    event.stopPropagation();
    event.preventDefault();
    this.deletingBoardId = id;
  }
}
