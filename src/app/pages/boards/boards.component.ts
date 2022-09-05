import { Component, OnInit } from '@angular/core';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { BoardService } from 'src/app/services/board.service';
import { UserService } from 'src/app/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Dialog } from '@angular/cdk/dialog';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css'],
})
export class BoardsComponent implements OnInit {
  faXmark = faXmark;
  title = '';
  description = '';
  titleError = false;
  descriptionError = false;
  isLoading = false;

  constructor(
    private modalService: NgbModal,
    public boardService: BoardService,
    public userService: UserService,
    public dialog: Dialog
  ) {}

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

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        () => {
          this.title = '';
          this.description = '';
          this.titleError = false;
          this.descriptionError = false;
        },
        () => {
          this.title = '';
          this.description = '';
          this.titleError = false;
          this.descriptionError = false;
        }
      );
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
}
