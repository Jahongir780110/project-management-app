import { Component, OnInit, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
})
export class ConfirmDialogComponent implements OnInit {
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  get dialogTitle() {
    let title = 'Do you really want to delete the ';

    switch (this.data.type) {
      case 'board':
        title += 'board';
        break;
      case 'user':
        title += 'user';
        break;
      case 'task':
        title += 'task';
        break;
      case 'column':
        title += 'column';
        break;
    }

    title += '?';
    return title;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  delete() {
    if (this.data.type === 'board') {
      this.dialogRef.close(this.data.id);
    } else if (this.data.type === 'user') {
      this.dialogRef.close('delete');
    } else if (this.data.type === 'task') {
      this.dialogRef.close('delete');
    } else if (this.data.type === 'column') {
      this.dialogRef.close('delete');
    }
  }
}
