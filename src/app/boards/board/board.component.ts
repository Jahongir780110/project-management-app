import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { UserService } from 'src/app/user/user.service';
import { BoardService } from '../board.service';
import { ColumnService } from 'src/app/boards/column.service';

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
    public boardService: BoardService,
    private columnService: ColumnService
  ) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe();

    this.isLoading = true;

    const boardId = this.route.snapshot.paramMap.get('id') as string;
    this.boardId = boardId;

    this.boardService.getBoard(boardId).subscribe({
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  createColumn(createColumn: NgForm) {
    if (createColumn.invalid) {
      Object.keys(createColumn.controls).forEach((field) => {
        createColumn.controls[field].markAsDirty({ onlySelf: true });
      });

      return;
    }

    this.columnService.addColumn(this.title).subscribe();
    this.modalService.dismissAll();
  }

  openModalWindow(content: any) {
    this.modalService.open(content).result.then(null, () => {
      this.initializeForm();
    });
  }

  drop(event: any) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    this.columnService
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
