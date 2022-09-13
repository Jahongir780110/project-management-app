import { Component, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { BoardService } from 'src/app/services/board.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css'],
})
export class BoardsComponent implements OnInit {
  title = '';
  description = '';
  titleError = false;
  descriptionError = false;
  search = '';
  isLoading = false;

  faXmark = faXmark;

  constructor(
    private modalService: NgbModal,
    private boardService: BoardService,
    private dialog: Dialog
  ) {}

  get filteredBoards() {
    if (this.search.trim().length === 0) {
      return this.boardService.boards;
    }

    return this.boardService.boards.filter(
      (b) =>
        b.title.includes(this.search) || b.description.includes(this.search)
    );
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.boardService.getAllBoards().subscribe({
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  createBoard() {
    this.titleError = false;
    this.descriptionError = false;

    if (!this.title.trim().length) {
      this.titleError = true;
      return;
    }
    if (!this.description.trim().length) {
      this.descriptionError = true;
      return;
    }

    this.boardService
      .createBoard(this.title, this.description)
      .subscribe(() => {
        this.modalService.dismissAll();
      });
  }

  deleteBoard(id: string) {
    this.boardService.deleteBoard(id).subscribe(() => {
      this.modalService.dismissAll();
    });
  }

  openModalWindow(content: any) {
    this.modalService.open(content).result.then(null, () => {
      this.initializeForm();
    });
  }

  openDialog(event: Event, id: string): void {
    event.stopPropagation();
    event.preventDefault();

    const dialogRef = this.dialog.open<string>(ConfirmDialogComponent, {
      data: {
        type: 'board',
        id,
      },
    });

    dialogRef.closed.subscribe((id) => {
      if (id) {
        this.deleteBoard(id);
      }
    });
  }

  initializeForm() {
    this.title = '';
    this.description = '';
    this.titleError = false;
    this.descriptionError = false;
  }
}
