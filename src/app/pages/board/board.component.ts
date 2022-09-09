import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { BoardService } from 'src/app/services/board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  title = '';
  titleError = false;
  boardId = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    public boardService: BoardService
  ) {}

  ngOnInit(): void {
    const boardId = this.route.snapshot.paramMap.get('id') as string;
    this.boardId = boardId;

    this.isLoading = true;

    this.boardService.getBoard(boardId).subscribe({
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  createColumn() {
    this.titleError = false;

    if (this.title.trim().length === 0) {
      this.titleError = true;
      return;
    }

    this.boardService.addColumn(this.title).subscribe();
    this.modalService.dismissAll();
  }

  openModalWindow(content: any) {
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

  drop(event: any) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    this.boardService
      .editColumn(
        event.item.data.id,
        event.currentIndex + 1,
        event.item.data.title
      )
      .subscribe();
  }

  initializeForm() {
    this.title = '';
    this.titleError = false;
  }
}
