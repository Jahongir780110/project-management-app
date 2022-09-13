import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { UserService } from 'src/app/services/user.service';
import { BoardService } from 'src/app/services/board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  title = '';
  boardId = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private userService: UserService,
    public boardService: BoardService
  ) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe();

    const boardId = this.route.snapshot.paramMap.get('id') as string;
    this.boardId = boardId;

    this.isLoading = true;

    this.boardService.getBoard(boardId).subscribe({
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  createColumn(createColumn: NgForm) {
    if (createColumn.invalid) {
      Object.keys(createColumn.controls).forEach((field) => {
        createColumn.controls[field].markAsTouched({ onlySelf: true });
      });

      return;
    }

    this.boardService.addColumn(this.title).subscribe();
    this.modalService.dismissAll();
  }

  openModalWindow(content: any) {
    this.modalService.open(content).result.then(null, () => {
      console.log('worked');

      this.initializeForm();
    });
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
  }
}
