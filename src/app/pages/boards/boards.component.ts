import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import { BoardService } from 'src/app/services/board.service';
import { TranslateService } from '@ngx-translate/core';
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
  search = '';
  isLoading = false;

  faXmark = faXmark;

  constructor(
    private modalService: NgbModal,
    private boardService: BoardService,
    private dialog: Dialog,
    private translateService: TranslateService
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

  createBoard(createBoard: NgForm) {
    if (createBoard.invalid) {
      Object.keys(createBoard.controls).forEach((field) => {
        createBoard.controls[field].markAsTouched({ onlySelf: true });
      });

      return;
    }

    this.boardService.createBoard(this.title, this.description).subscribe({
      complete: () => {
        this.modalService.dismissAll();
      },
    });
  }

  deleteBoard(id: string) {
    this.boardService.deleteBoard(id).subscribe({
      complete: () => {
        this.modalService.dismissAll();
      },
    });
  }

  openModalWindow(content: any) {
    this.modalService.open(content);
  }

  openConfirmDialog(event: Event, id: string): void {
    event.stopPropagation();
    event.preventDefault();

    const dialogRef = this.dialog.open<string>(ConfirmDialogComponent, {
      data: {
        title: this.translateService.instant('deleteBoardPrompt'),
      },
    });

    dialogRef.closed.subscribe((message) => {
      if (message) {
        this.deleteBoard(id);
      }
    });
  }

  initializeForm() {
    this.title = '';
    this.description = '';
  }
}
